cmake_minimum_required(VERSION 3.24)
if(POLICY CMP0167)
  cmake_policy(SET CMP0167 NEW)
endif()

project(lumatorrent_native_engine LANGUAGES CXX)

option(LUMATORRENT_WITH_LIBTORRENT "Build with libtorrent support" OFF)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(lumatorrent-native-engine
  src/main.cpp
  src/http_server.cpp
  src/engine_session.cpp
  src/security.cpp
)

target_include_directories(lumatorrent-native-engine PRIVATE include)

target_compile_definitions(lumatorrent-native-engine PRIVATE
  LUMATORRENT_ENGINE_VERSION="0.1.0"
  _WIN32_WINNT=0x0A00
)

if (MSVC)
  target_compile_options(lumatorrent-native-engine PRIVATE /W4 /permissive- /EHsc)
else()
  target_compile_options(lumatorrent-native-engine PRIVATE -Wall -Wextra -Wpedantic)
endif()

if (WIN32)
  target_link_libraries(lumatorrent-native-engine PRIVATE ws2_32)
endif()

if (LUMATORRENT_WITH_LIBTORRENT)
  find_package(LibtorrentRasterbar CONFIG QUIET)
  if (LibtorrentRasterbar_FOUND)
    target_link_libraries(lumatorrent-native-engine PRIVATE LibtorrentRasterbar::torrent-rasterbar)
    target_compile_definitions(lumatorrent-native-engine PRIVATE LUMATORRENT_WITH_LIBTORRENT=1)
  else()
    find_package(libtorrent-rasterbar CONFIG QUIET)
    if (libtorrent-rasterbar_FOUND)
      target_link_libraries(lumatorrent-native-engine PRIVATE libtorrent-rasterbar::torrent-rasterbar)
      target_compile_definitions(lumatorrent-native-engine PRIVATE LUMATORRENT_WITH_LIBTORRENT=1)
    else()
      message(FATAL_ERROR "libtorrent was requested but was not found. Run scripts/setup-libtorrent.* or configure CMAKE_PREFIX_PATH/vcpkg.")
    endif()
  endif()
endif()

install(TARGETS lumatorrent-native-engine RUNTIME DESTINATION bin)

# Contract smoke target to enable once native engine CI stabilizes.
# add_executable(contract_smoke tests/contract_smoke.cpp src/engine_contract.cpp)
# target_include_directories(contract_smoke PRIVATE include)
