#include "lumatorrent/engine_session.hpp"

#include <algorithm>
#include <cctype>
#include <cstdint>
#include <ctime>
#include <filesystem>
#include <iomanip>
#include <memory>
#include <sstream>
#include <string>
#include <vector>

#ifdef LUMATORRENT_WITH_LIBTORRENT
#include <libtorrent/add_torrent_params.hpp>
#include <libtorrent/alert.hpp>
#include <libtorrent/alert_types.hpp>
#include <libtorrent/error_code.hpp>
#include <libtorrent/session.hpp>
#include <libtorrent/session_params.hpp>
#include <libtorrent/magnet_uri.hpp>
#include <libtorrent/torrent_info.hpp>
#include <libtorrent/torrent_flags.hpp>
#endif

namespace lumatorrent {
namespace {

struct NativeTorrentRecord {
  std::string id;
  std::string name;
  std::string status;
  std::string save_path;
  double progress = 0.0;
  long long download_speed_bytes = 0;
  long long upload_speed_bytes = 0;
  int seeders = 0;
  int peers = 0;
  long long size_bytes = 0;
  std::vector<std::pair<std::string, long long>> files;
#ifdef LUMATORRENT_WITH_LIBTORRENT
  lt::torrent_handle handle;
#endif
};

struct NativeEventRecord {
  unsigned long long sequence;
  std::string type;
  std::string timestamp;
  std::string torrent_id;
  std::string payload;
};

std::string json_escape(const std::string& value) {
  std::ostringstream out;
  for (const char ch : value) {
    switch (ch) {
      case '\\': out << "\\\\"; break;
      case '"': out << "\\\""; break;
      case '\b': out << "\\b"; break;
      case '\f': out << "\\f"; break;
      case '\n': out << "\\n"; break;
      case '\r': out << "\\r"; break;
      case '\t': out << "\\t"; break;
      default: out << ch; break;
    }
  }
  return out.str();
}

std::string infer_magnet_name(const std::string& magnet_uri) {
  const auto marker = magnet_uri.find("dn=");
  if (marker == std::string::npos) return "Magnet download";
  auto value = magnet_uri.substr(marker + 3);
  const auto end = value.find('&');
  if (end != std::string::npos) value = value.substr(0, end);
  std::replace(value.begin(), value.end(), '+', ' ');
  return value.empty() ? "Magnet download" : value;
}

std::string error_json(const std::string& code, const std::string& message, bool recoverable) {
  return "{\"code\":\"" + json_escape(code) + "\",\"message\":\"" + json_escape(message)
    + "\",\"recoverable\":" + (recoverable ? "true" : "false") + "}";
}

bool has_torrent_extension(std::string path) {
  std::transform(path.begin(), path.end(), path.begin(), [](unsigned char ch) {
    return static_cast<char>(std::tolower(ch));
  });
  return path.size() >= 8 && path.substr(path.size() - 8) == ".torrent";
}

bool is_safe_torrent_relative_path(const std::string& path) {
  if (path.empty()) return false;
  if (path.front() == '/' || path.front() == '\\') return false;
  if (path.size() > 1 && path[1] == ':') return false;

  std::string normalized = path;
  std::replace(normalized.begin(), normalized.end(), '\\', '/');
  std::size_t start = 0;
  while (start <= normalized.size()) {
    const auto end = normalized.find('/', start);
    const auto segment = normalized.substr(
      start,
      end == std::string::npos ? std::string::npos : end - start
    );
    if (segment.empty() || segment == "." || segment == "..") return false;
    if (std::any_of(segment.begin(), segment.end(), [](unsigned char ch) {
          return ch < 0x20;
        })) {
      return false;
    }
    if (end == std::string::npos) break;
    start = end + 1;
  }
  return true;
}

std::string utc_now_iso() {
  const auto now = std::time(nullptr);
  std::tm utc{};
#ifdef _WIN32
  gmtime_s(&utc, &now);
#else
  gmtime_r(&now, &utc);
#endif
  std::ostringstream out;
  out << std::put_time(&utc, "%Y-%m-%dT%H:%M:%SZ");
  return out.str();
}

std::string torrent_summary_payload(const NativeTorrentRecord& torrent) {
  std::ostringstream out;
  out << "{\"status\":\"" << json_escape(torrent.status) << "\","
      << "\"summary\":{"
      << "\"id\":\"" << json_escape(torrent.id) << "\","
      << "\"infoHash\":\"" << json_escape(torrent.id) << "\","
      << "\"name\":\"" << json_escape(torrent.name) << "\","
      << "\"status\":\"" << json_escape(torrent.status) << "\","
      << "\"progress\":" << torrent.progress << ","
      << "\"downloadSpeedBytes\":" << torrent.download_speed_bytes << ","
      << "\"uploadSpeedBytes\":" << torrent.upload_speed_bytes << ","
      << "\"etaSeconds\":null,"
      << "\"health\":\"checking\","
      << "\"healthConfidence\":0.2,"
      << "\"seeders\":" << torrent.seeders << ","
      << "\"peers\":" << torrent.peers << ","
      << "\"sizeBytes\":" << torrent.size_bytes << ","
      << "\"downloadedBytes\":0,"
      << "\"uploadedBytes\":0,"
      << "\"savePath\":\"" << json_escape(torrent.save_path) << "\","
      << "\"addedAtIso\":\"1970-01-01T00:00:00Z\","
      << "\"files\":[";
  for (std::size_t i = 0; i < torrent.files.size(); ++i) {
    if (i > 0) out << ",";
    out << "{\"id\":\"file-" << i << "\","
        << "\"path\":\"" << json_escape(torrent.files[i].first) << "\","
        << "\"sizeBytes\":" << torrent.files[i].second << ","
        << "\"progress\":0,"
        << "\"priority\":\"normal\","
        << "\"risk\":\"normal\"}";
  }
  out << "]}}";
  return out.str();
}

#ifdef LUMATORRENT_WITH_LIBTORRENT
std::string status_from_libtorrent_state(const lt::torrent_status& status) {
  if ((status.flags & lt::torrent_flags::paused) != lt::torrent_flags_t{}) return "paused";
  if (status.errc) return "error";

  switch (status.state) {
    case lt::torrent_status::checking_files:
    case lt::torrent_status::checking_resume_data: return "checking";
    case lt::torrent_status::downloading_metadata: return "metadata";
    case lt::torrent_status::downloading: return "downloading";
    case lt::torrent_status::finished: return "completed";
    case lt::torrent_status::seeding: return "seeding";
    default: return "metadata";
  }
}

lt::sha1_hash sha1_from_hex(const std::string& hex_value) {
  lt::sha1_hash hash;
  if (hex_value.size() != 40) return hash;

  std::string bytes;
  bytes.reserve(20);
  for (std::size_t i = 0; i < hex_value.size(); i += 2) {
    const auto byte = static_cast<char>(std::stoi(hex_value.substr(i, 2), nullptr, 16));
    bytes.push_back(byte);
  }
  hash.assign(bytes.data());
  return hash;
}

std::string best_info_hash_hex(const lt::info_hash_t& hashes) {
  constexpr char hex[] = "0123456789abcdef";
  const auto hash = hashes.get_best().to_string();
  std::string value;
  value.reserve(hash.size() * 2);
  for (const unsigned char byte : hash) {
    value.push_back(hex[(byte >> 4) & 0x0f]);
    value.push_back(hex[byte & 0x0f]);
  }
  return value;
}

void populate_files_from_info(NativeTorrentRecord& torrent, const lt::torrent_info& info) {
  torrent.name = info.name();
  torrent.size_bytes = info.total_size();
  torrent.files.clear();
  const auto& files = info.files();
  for (lt::file_index_t index{0}; index < files.end_file(); ++index) {
    torrent.files.push_back({ files.file_path(index), files.file_size(index) });
  }
}
#endif

} // namespace

class EngineSession::Impl {
public:
  std::vector<NativeTorrentRecord> torrents;
  std::vector<NativeEventRecord> events;
  unsigned long long next_sequence = 1;
  std::time_t started_at_epoch = std::time(nullptr);
  std::string started_at_iso = utc_now_iso();

#ifdef LUMATORRENT_WITH_LIBTORRENT
  lt::session session;
  Impl() : session(lt::session_params{}) {}
#else
  Impl() = default;
#endif

  NativeTorrentRecord* find_torrent(const std::string& id) {
    const auto match = std::find_if(
      torrents.begin(),
      torrents.end(),
      [&](const NativeTorrentRecord& record) { return record.id == id; }
    );
    return match == torrents.end() ? nullptr : &(*match);
  }

  void emit_event(
    const std::string& type,
    const std::string& torrent_id,
    const std::string& payload
  ) {
    events.push_back(NativeEventRecord{
      next_sequence++,
      type,
      utc_now_iso(),
      torrent_id,
      payload,
    });
    constexpr std::size_t max_events = 1024;
    if (events.size() > max_events) {
      events.erase(events.begin(), events.begin() + static_cast<long long>(events.size() - max_events));
    }
  }

#ifdef LUMATORRENT_WITH_LIBTORRENT
  lt::torrent_handle handle_for(const std::string& id) {
    if (auto* torrent = find_torrent(id)) {
      if (torrent->handle.is_valid()) return torrent->handle;
    }
    const auto hash = sha1_from_hex(id);
    auto handle = session.find_torrent(hash);
    if (handle.is_valid()) {
      if (auto* torrent = find_torrent(id)) {
        torrent->handle = handle;
      }
    }
    return handle;
  }
#endif
};

EngineSession::EngineSession() : impl_(new Impl()) {}
EngineSession::~EngineSession() { delete impl_; }

std::string EngineSession::health_json() const {
  const auto uptime = std::max<long long>(0, std::time(nullptr) - impl_->started_at_epoch);
#ifdef LUMATORRENT_WITH_LIBTORRENT
  const std::string backend = "libtorrent";
#else
  const std::string backend = "stub";
#endif
  return "{\"ok\":true,\"apiVersion\":\"v1\",\"engineVersion\":\"native-0.1.0\","
    "\"torrentBackend\":\"" + backend + "\",\"uptimeSeconds\":" + std::to_string(uptime)
    + ",\"startedAtIso\":\"" + json_escape(impl_->started_at_iso) + "\"}";
}

std::string EngineSession::add_magnet(const std::string& magnet_uri, const std::string& save_path) {
  if (magnet_uri.empty() || magnet_uri.rfind("magnet:?", 0) != 0) {
    return error_json("INVALID_MAGNET", "Magnet URI is missing or invalid.", true);
  }
  if (save_path.empty()) {
    return error_json("PATH_REJECTED", "Save path is required.", true);
  }

#ifdef LUMATORRENT_WITH_LIBTORRENT
  lt::error_code ec;
  auto params = lt::parse_magnet_uri(magnet_uri, ec);
  if (ec) {
    return error_json("INVALID_MAGNET", ec.message(), true);
  }
  if (!params.info_hashes.has_v1() && !params.info_hashes.has_v2()) {
    return error_json("INVALID_MAGNET", "Magnet URI must include an info hash.", true);
  }

  params.save_path = save_path;
  params.flags &= ~lt::torrent_flags::paused;
  params.flags |= lt::torrent_flags::auto_managed;

  const auto torrent_id = best_info_hash_hex(params.info_hashes);
  const auto duplicate = std::any_of(
    impl_->torrents.begin(),
    impl_->torrents.end(),
    [&](const NativeTorrentRecord& record) { return record.id == torrent_id; }
  );
  if (duplicate) {
    return error_json("DUPLICATE_TORRENT", "This torrent is already in the list.", true);
  }

  impl_->session.async_add_torrent(params);
  impl_->torrents.push_back(NativeTorrentRecord{
    torrent_id,
    infer_magnet_name(magnet_uri),
    "metadata",
    save_path,
    0.0,
    0,
    0,
    0,
    0,
    0,
    {},
#ifdef LUMATORRENT_WITH_LIBTORRENT
    {},
#endif
  });
  impl_->emit_event("torrent.added", torrent_id, torrent_summary_payload(impl_->torrents.back()));
  return "{\"torrentId\":\"" + json_escape(torrent_id) + "\",\"status\":\"metadata\"}";
#else
  return R"({"accepted":false,"reason":"native engine built in stub mode"})";
#endif
}

std::string EngineSession::add_torrent_file(
  const std::string& torrent_file_path,
  const std::string& save_path
) {
  if (torrent_file_path.empty()) {
    return error_json("TORRENT_PARSE_FAILED", "Torrent file path is required.", true);
  }
  if (!has_torrent_extension(torrent_file_path)) {
    return error_json("TORRENT_PARSE_FAILED", "Only .torrent files can be imported.", true);
  }
  if (save_path.empty()) {
    return error_json("PATH_REJECTED", "Save path is required.", true);
  }

#ifdef LUMATORRENT_WITH_LIBTORRENT
  std::error_code file_size_error;
  const auto metadata_size = std::filesystem::file_size(torrent_file_path, file_size_error);
  if (file_size_error) {
    return error_json(
      "TORRENT_PARSE_FAILED",
      "Torrent file could not be read: " + file_size_error.message(),
      true
    );
  }
  constexpr std::uintmax_t max_torrent_metadata_bytes = 10'000'000;
  if (metadata_size > max_torrent_metadata_bytes) {
    return error_json("TORRENT_PARSE_FAILED", "Torrent file is too large.", true);
  }

  lt::error_code ec;
  auto info = std::make_shared<lt::torrent_info>(torrent_file_path, ec);
  if (ec) {
    return error_json("TORRENT_PARSE_FAILED", ec.message(), true);
  }

  const auto torrent_id = best_info_hash_hex(info->info_hashes());
  const auto duplicate = std::any_of(
    impl_->torrents.begin(),
    impl_->torrents.end(),
    [&](const NativeTorrentRecord& record) { return record.id == torrent_id; }
  );
  if (duplicate) {
    return error_json("DUPLICATE_TORRENT", "This torrent is already in the list.", true);
  }

  lt::add_torrent_params params;
  params.ti = info;
  params.save_path = save_path;
  params.flags &= ~lt::torrent_flags::paused;
  params.flags |= lt::torrent_flags::auto_managed;

  NativeTorrentRecord record{
    torrent_id,
    info->name(),
    "checking",
    save_path,
    0.0,
    0,
    0,
    0,
    0,
    info->total_size(),
    {},
#ifdef LUMATORRENT_WITH_LIBTORRENT
    {},
#endif
  };
  populate_files_from_info(record, *info);
  const auto unsafe_file = std::find_if(
    record.files.begin(),
    record.files.end(),
    [](const std::pair<std::string, long long>& file) {
      return !is_safe_torrent_relative_path(file.first);
    }
  );
  if (unsafe_file != record.files.end()) {
    return error_json(
      "TORRENT_PARSE_FAILED",
      "Torrent file contains an unsafe file path: " + unsafe_file->first,
      true
    );
  }

  impl_->session.async_add_torrent(params);
  impl_->torrents.push_back(record);
  impl_->emit_event("torrent.added", torrent_id, torrent_summary_payload(impl_->torrents.back()));
  impl_->emit_event("torrent.metadata", torrent_id, torrent_summary_payload(impl_->torrents.back()));
  return "{\"torrentId\":\"" + json_escape(torrent_id) + "\",\"status\":\"checking\"}";
#else
  return R"({"accepted":false,"reason":"native engine built in stub mode"})";
#endif
}

std::string EngineSession::list_torrents_json() const {
  std::ostringstream out;
  out << "[";
  for (std::size_t i = 0; i < impl_->torrents.size(); ++i) {
    const auto& torrent = impl_->torrents[i];
    if (i > 0) out << ",";
    out << "{\"id\":\"" << json_escape(torrent.id) << "\","
        << "\"name\":\"" << json_escape(torrent.name) << "\","
        << "\"status\":\"" << json_escape(torrent.status) << "\","
        << "\"progress\":" << torrent.progress << ","
        << "\"downloadSpeedBytes\":" << torrent.download_speed_bytes << ","
        << "\"uploadSpeedBytes\":" << torrent.upload_speed_bytes << ","
        << "\"etaSeconds\":null,"
        << "\"health\":\"checking\","
        << "\"healthConfidence\":0.2,"
        << "\"seeders\":" << torrent.seeders << ","
        << "\"peers\":" << torrent.peers << ","
        << "\"sizeBytes\":" << torrent.size_bytes << ","
        << "\"downloadedBytes\":0,"
        << "\"uploadedBytes\":0,"
        << "\"savePath\":\"" << json_escape(torrent.save_path) << "\","
        << "\"addedAtIso\":\"1970-01-01T00:00:00Z\","
        << "\"files\":[";
    for (std::size_t file_index = 0; file_index < torrent.files.size(); ++file_index) {
      if (file_index > 0) out << ",";
      out << "{\"id\":\"file-" << file_index << "\","
          << "\"path\":\"" << json_escape(torrent.files[file_index].first) << "\","
          << "\"sizeBytes\":" << torrent.files[file_index].second << ","
          << "\"progress\":0,"
          << "\"priority\":\"normal\","
          << "\"risk\":\"normal\"}";
    }
    out << "]}";
  }
  out << "]";
  return out.str();
}

std::string EngineSession::events_json(unsigned long long after_sequence, unsigned int limit) {
#ifdef LUMATORRENT_WITH_LIBTORRENT
  std::vector<lt::alert*> alerts;
  impl_->session.pop_alerts(&alerts);
  for (const auto* alert : alerts) {
    if (const auto* add = lt::alert_cast<lt::add_torrent_alert>(alert)) {
      const auto torrent_id = best_info_hash_hex(add->params.info_hashes);
      if (add->error) {
        if (auto* torrent = impl_->find_torrent(torrent_id)) {
          torrent->status = "error";
        }
        impl_->emit_event(
          "torrent.error",
          torrent_id,
          "{\"status\":\"error\",\"error\":" + error_json("ENGINE_UNAVAILABLE", add->error.message(), true) + "}"
        );
      } else if (auto* torrent = impl_->find_torrent(torrent_id)) {
        torrent->handle = add->handle;
      }
      continue;
    }

    if (const auto* metadata = lt::alert_cast<lt::metadata_received_alert>(alert)) {
      const auto torrent_id = best_info_hash_hex(metadata->handle.info_hashes());
      auto* torrent = impl_->find_torrent(torrent_id);
      if (torrent != nullptr) {
        torrent->status = "downloading";
        const auto info = metadata->handle.torrent_file();
        if (info) {
          populate_files_from_info(*torrent, *info);
        }
        impl_->emit_event("torrent.metadata", torrent_id, torrent_summary_payload(*torrent));
      }
      continue;
    }

    if (const auto* update = lt::alert_cast<lt::state_update_alert>(alert)) {
      for (const auto& status : update->status) {
        const auto torrent_id = best_info_hash_hex(status.handle.info_hashes());
        auto* torrent = impl_->find_torrent(torrent_id);
        if (torrent == nullptr) continue;

        torrent->status = status_from_libtorrent_state(status);
        torrent->progress = status.progress;
        torrent->download_speed_bytes = status.download_payload_rate;
        torrent->upload_speed_bytes = status.upload_payload_rate;
        torrent->seeders = status.num_seeds >= 0 ? status.num_seeds : 0;
        torrent->peers = status.num_peers >= 0 ? status.num_peers : 0;
        torrent->size_bytes = status.total_wanted > 0 ? status.total_wanted : torrent->size_bytes;
        impl_->emit_event("torrent.progress", torrent_id, torrent_summary_payload(*torrent));
      }
      continue;
    }

    if (const auto* error = lt::alert_cast<lt::torrent_error_alert>(alert)) {
      const auto torrent_id = best_info_hash_hex(error->handle.info_hashes());
      if (auto* torrent = impl_->find_torrent(torrent_id)) {
        torrent->status = "error";
      }
      impl_->emit_event(
        "torrent.error",
        torrent_id,
        "{\"status\":\"error\",\"error\":"
          + error_json("ENGINE_UNAVAILABLE", error->error.message(), true) + "}"
      );
    }
  }

  impl_->session.post_torrent_updates();
#endif

  const auto capped_limit = limit == 0 ? 1024 : std::min<unsigned int>(limit, 1024);
  std::ostringstream out;
  out << "{\"events\":[";
  unsigned int written = 0;
  for (const auto& event : impl_->events) {
    if (event.sequence <= after_sequence) continue;
    if (written >= capped_limit) break;
    if (written > 0) out << ",";
    out << "{\"type\":\"" << json_escape(event.type) << "\","
        << "\"timestamp\":\"" << json_escape(event.timestamp) << "\","
        << "\"sequence\":" << event.sequence;
    if (!event.torrent_id.empty()) {
      out << ",\"torrentId\":\"" << json_escape(event.torrent_id) << "\"";
    }
    out << ",\"payload\":" << event.payload << "}";
    ++written;
  }
  out << "]}";
  return out.str();
}

bool EngineSession::pause(const std::string& torrent_id) {
  auto* torrent = impl_->find_torrent(torrent_id);
  if (torrent == nullptr) return false;
#ifdef LUMATORRENT_WITH_LIBTORRENT
  auto handle = impl_->handle_for(torrent_id);
  if (handle.is_valid()) {
    handle.pause();
  }
#endif
  torrent->status = "paused";
  impl_->emit_event("torrent.paused", torrent_id, torrent_summary_payload(*torrent));
  return true;
}

bool EngineSession::resume(const std::string& torrent_id) {
  auto* torrent = impl_->find_torrent(torrent_id);
  if (torrent == nullptr) return false;
#ifdef LUMATORRENT_WITH_LIBTORRENT
  auto handle = impl_->handle_for(torrent_id);
  if (handle.is_valid()) {
    handle.resume();
  }
#endif
  torrent->status = torrent->size_bytes > 0 ? "downloading" : "metadata";
  impl_->emit_event("torrent.metadata", torrent_id, torrent_summary_payload(*torrent));
  return true;
}

bool EngineSession::remove(const std::string& torrent_id, bool delete_files) {
  (void)delete_files;
  const auto match = std::find_if(
    impl_->torrents.begin(),
    impl_->torrents.end(),
    [&](const NativeTorrentRecord& record) { return record.id == torrent_id; }
  );
  if (match == impl_->torrents.end()) return false;

#ifdef LUMATORRENT_WITH_LIBTORRENT
  auto handle = impl_->handle_for(torrent_id);
  if (handle.is_valid()) {
    impl_->session.remove_torrent(handle);
  }
#endif

  impl_->torrents.erase(match);
  return true;
}

} // namespace lumatorrent
