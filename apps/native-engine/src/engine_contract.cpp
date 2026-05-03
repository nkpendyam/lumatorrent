#include "luma_engine/engine_contract.hpp"

namespace luma_engine {
EngineHealth get_engine_health() {
  return EngineHealth{"ok", "0.1.0", "stub"};
}

bool is_loopback_bind_address(const std::string& address) {
  return address == "127.0.0.1" || address == "::1" || address == "localhost";
}
}
