#pragma once

#include <string>
#include <vector>

namespace lumatorrent {

enum class TorrentStatus {
  finding_metadata,
  downloading,
  paused,
  completed,
  seeding,
  error
};

struct TorrentSummary {
  std::string id;
  std::string name;
  TorrentStatus status;
  double progress;
  long long download_speed_bytes;
  long long upload_speed_bytes;
  long long eta_seconds;
};

class EngineSession {
public:
  EngineSession();
  ~EngineSession();

  std::string health_json() const;
  std::string add_magnet(const std::string& magnet_uri, const std::string& save_path);
  std::string add_torrent_file(const std::string& torrent_file_path, const std::string& save_path);
  std::string list_torrents_json() const;
  std::string events_json(unsigned long long after_sequence, unsigned int limit);
  bool pause(const std::string& torrent_id);
  bool resume(const std::string& torrent_id);
  bool remove(const std::string& torrent_id, bool delete_files);

private:
  class Impl;
  Impl* impl_;
};

} // namespace lumatorrent
