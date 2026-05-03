#include "luma_engine/engine_contract.hpp"
#include <cassert>

int main() {
  auto health = luma_engine::get_engine_health();
  assert(health.status == "ok");
  assert(luma_engine::is_loopback_bind_address("127.0.0.1"));
  assert(!luma_engine::is_loopback_bind_address("0.0.0.0"));
  return 0;
}
