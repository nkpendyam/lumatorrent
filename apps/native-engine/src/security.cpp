#include "lumatorrent/security.hpp"
#include <cstdlib>
#include <filesystem>

namespace lumatorrent {

bool is_loopback_bind_address(const std::string& host) {
  return host == "127.0.0.1" || host == "localhost" || host == "::1";
}

bool is_probably_safe_save_path(const std::string& path) {
  if (path.empty()) return false;
  if (path.find("..") != std::string::npos) return false;
  if (path.find('\0') != std::string::npos) return false;
  return true;
}

std::string require_engine_token_from_env() {
  const char* token = std::getenv("LUMATORRENT_ENGINE_TOKEN");
  if (!token) return "";
  return std::string(token);
}

} // namespace lumatorrent
