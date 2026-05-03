#!/usr/bin/env bash
set -euo pipefail

OS="$(uname -s)"

echo "Setting up native libtorrent dependencies for $OS"

if [[ "$OS" == "Darwin" ]]; then
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew is required. Install it from https://brew.sh then rerun this script." >&2
    exit 1
  fi
  brew update
  brew install cmake ninja pkg-config boost libtorrent-rasterbar
  echo "macOS libtorrent dependencies installed."
  exit 0
fi

if [[ "$OS" == "Linux" ]]; then
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y build-essential cmake ninja-build pkg-config libboost-system-dev libboost-filesystem-dev libboost-thread-dev libssl-dev libtorrent-rasterbar-dev
    echo "Debian/Ubuntu libtorrent dependencies installed."
    exit 0
  fi
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y gcc-c++ cmake ninja-build pkgconf-pkg-config boost-devel openssl-devel rb_libtorrent-devel
    echo "Fedora libtorrent dependencies installed."
    exit 0
  fi
  echo "Unsupported Linux package manager. Install cmake, ninja, boost, openssl, and libtorrent-rasterbar development headers manually." >&2
  exit 1
fi

echo "Unsupported OS for this script: $OS" >&2
exit 1
