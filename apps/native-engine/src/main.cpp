#include "lumatorrent/engine_session.hpp"
#include "lumatorrent/http_server.hpp"
#include "lumatorrent/security.hpp"
#include <cstdlib>
#include <cstdint>
#include <iostream>
#include <string>

namespace {

std::string env_or_default(const char* name, const std::string& fallback) {
#ifdef _WIN32
  char* value = nullptr;
  std::size_t value_size = 0;
  if (_dupenv_s(&value, &value_size, name) == 0 && value != nullptr) {
    std::string result(value);
    std::free(value);
    return result;
  }
  return fallback;
#else
  const auto* value = std::getenv(name);
  return value == nullptr ? fallback : value;
#endif
}

} // namespace

int main(int argc, char** argv) {
  std::string host = "127.0.0.1";
  std::string port = env_or_default("LUMATORRENT_ENGINE_PORT", "47831");
  bool serve = false;

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "--host" && i + 1 < argc) host = argv[++i];
    if (arg == "--port" && i + 1 < argc) port = argv[++i];
    if (arg == "--serve") serve = true;
  }

  if (!lumatorrent::is_loopback_bind_address(host)) {
    std::cerr << "Refusing to bind native engine to non-loopback host: " << host << "\n";
    return 2;
  }

  const auto token = lumatorrent::require_engine_token_from_env();
  if (token.size() < 32) {
    std::cerr << "LUMATORRENT_ENGINE_TOKEN must be set and at least 32 characters.\n";
    return 3;
  }

  lumatorrent::EngineSession session;
  std::cout << "LumaTorrent native engine " << LUMATORRENT_ENGINE_VERSION
            << " listening on " << host << ":" << port << "\n";

#ifdef LUMATORRENT_WITH_LIBTORRENT
  std::cout << "libtorrent mode enabled\n";
#else
  std::cout << "stub mode enabled; no real torrent downloads will run\n";
#endif

  if (serve) {
    const auto port_number = static_cast<std::uint16_t>(std::stoi(port));
    return lumatorrent::run_loopback_http_server(host, port_number, token, session);
  }

  return 0;
}
