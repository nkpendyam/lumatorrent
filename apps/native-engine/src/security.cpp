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
#ifdef _WIN32
  char* token = nullptr;
  size_t token_size = 0;
  if (_dupenv_s(&token, &token_size, "LUMATORRENT_ENGINE_TOKEN") != 0 || token == nullptr) {
    return "";
  }
  std::string value(token, token_size > 0 ? token_size - 1 : 0);
  std::free(token);
  return value;
#else
  const char* token = std::getenv("LUMATORRENT_ENGINE_TOKEN");
  if (!token) return "";
  return std::string(token);
#endif
}

} // namespace lumatorrent
