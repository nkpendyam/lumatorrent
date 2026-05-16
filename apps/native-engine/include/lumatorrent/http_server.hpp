#pragma once

#include "lumatorrent/engine_session.hpp"
#include <cstdint>
#include <string>

namespace lumatorrent {

int run_loopback_http_server(
  const std::string& host,
  std::uint16_t port,
  const std::string& token,
  EngineSession& session
);

} // namespace lumatorrent
