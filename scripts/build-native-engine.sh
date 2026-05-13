#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-stub}"
BUILD_DIR="build/native-engine-${MODE}"
EXTRA_ARGS=()

if [[ "$MODE" == "libtorrent" ]]; then
  EXTRA_ARGS+=("-DLUMATORRENT_WITH_LIBTORRENT=ON")
else
  EXTRA_ARGS+=("-DLUMATORRENT_WITH_LIBTORRENT=OFF")
fi

cmake -S apps/native-engine -B "$BUILD_DIR" -G Ninja "${EXTRA_ARGS[@]}"
cmake --build "$BUILD_DIR" --config Release

echo "Native engine built at $BUILD_DIR"
