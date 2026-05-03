#pragma once

#include <string>

namespace lumatorrent {

bool is_loopback_bind_address(const std::string& host);
bool is_probably_safe_save_path(const std::string& path);
std::string require_engine_token_from_env();

} // namespace lumatorrent
