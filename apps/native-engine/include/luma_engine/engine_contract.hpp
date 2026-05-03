#pragma once
#include <string>

namespace luma_engine {
struct EngineHealth {
  std::string status;
  std::string version;
  std::string mode;
};

EngineHealth get_engine_health();
bool is_loopback_bind_address(const std::string& address);
}
