#include "lumatorrent/engine_session.hpp"
#include <sstream>

#ifdef LUMATORRENT_WITH_LIBTORRENT
#include <libtorrent/session.hpp>
#include <libtorrent/session_params.hpp>
#include <libtorrent/magnet_uri.hpp>
#endif

namespace lumatorrent {

class EngineSession::Impl {
public:
#ifdef LUMATORRENT_WITH_LIBTORRENT
  lt::session session;
  Impl() : session(lt::session_params{}) {}
#else
  Impl() = default;
#endif
};

EngineSession::EngineSession() : impl_(new Impl()) {}
EngineSession::~EngineSession() { delete impl_; }

std::string EngineSession::health_json() const {
#ifdef LUMATORRENT_WITH_LIBTORRENT
  return R"({"status":"ok","engine":"libtorrent","mode":"native"})";
#else
  return R"({"status":"ok","engine":"stub","mode":"native"})";
#endif
}

std::string EngineSession::add_magnet(const std::string& magnet_uri, const std::string& save_path) {
  (void)magnet_uri;
  (void)save_path;
#ifdef LUMATORRENT_WITH_LIBTORRENT
  // TODO NATIVE-003: parse magnet, validate save path, add torrent params, return stable torrent id.
  return R"({"accepted":false,"reason":"libtorrent add_magnet implementation pending"})";
#else
  return R"({"accepted":false,"reason":"native engine built in stub mode"})";
#endif
}

std::string EngineSession::list_torrents_json() const {
  return R"({"torrents":[]})";
}

bool EngineSession::pause(const std::string& torrent_id) {
  (void)torrent_id;
  return false;
}

bool EngineSession::resume(const std::string& torrent_id) {
  (void)torrent_id;
  return false;
}

bool EngineSession::remove(const std::string& torrent_id, bool delete_files) {
  (void)torrent_id;
  (void)delete_files;
  return false;
}

} // namespace lumatorrent
