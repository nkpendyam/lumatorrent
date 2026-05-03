#include "lumatorrent/engine_session.hpp"
#include "lumatorrent/security.hpp"
#include <cstdlib>
#include <iostream>
#include <string>

int main(int argc, char** argv) {
  std::string host = "127.0.0.1";
  std::string port = "47831";

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "--host" && i + 1 < argc) host = argv[++i];
    if (arg == "--port" && i + 1 < argc) port = argv[++i];
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

  // TODO: Replace with production HTTP/IPC server in milestone NATIVE-002.
  // Keep this process alive enough for smoke tests.
  return 0;
}
