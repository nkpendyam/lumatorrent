#!/usr/bin/env bash
set -euo pipefail

INSTALL=false
YES=false
for arg in "$@"; do
  case "$arg" in
    --install) INSTALL=true ;;
    --yes) YES=true ;;
  esac
done

need() { command -v "$1" >/dev/null 2>&1; }

confirm() {
  if [ "$YES" = true ]; then return 0; fi
  read -r -p "$1 [y/N] " ans
  [[ "$ans" == "y" || "$ans" == "Y" ]]
}

install_node_pnpm() {
  if ! need node; then
    echo "Node.js missing. Install Node.js 20+ using your OS package manager or Volta."
  fi
  if need corepack; then
    corepack enable || true
    corepack prepare pnpm@latest --activate || true
  elif ! need pnpm; then
    npm install -g pnpm
  fi
}

install_rust() {
  if ! need rustc; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    # shellcheck disable=SC1090
    source "$HOME/.cargo/env"
  fi
}

echo "LumaTorrent bootstrap"
if [ "$INSTALL" = false ]; then
  echo "Safe check mode. No installs will be performed. Use --install --yes to install."
  ./scripts/doctor.sh || true
  exit 0
fi

if ! confirm "This may install development dependencies. Continue?"; then
  echo "Cancelled."
  exit 0
fi

case "$(uname -s)" in
  Darwin)
    if need brew; then
      brew install node rust cmake pkg-config pnpm || true
    else
      echo "Homebrew missing. Install Homebrew first: https://brew.sh"
    fi
    ;;
  Linux)
    if need apt-get; then
      sudo apt-get update
      sudo apt-get install -y build-essential curl git cmake pkg-config libssl-dev nodejs npm python3
    elif need dnf; then
      sudo dnf install -y gcc gcc-c++ make curl git cmake pkgconf-pkg-config openssl-devel nodejs npm python3
    elif need pacman; then
      sudo pacman -Syu --needed base-devel curl git cmake pkgconf openssl nodejs npm python
    else
      echo "Unsupported Linux package manager. Install git, node, pnpm, rust, cmake, pkg-config manually."
    fi
    install_node_pnpm
    install_rust
    ;;
  *)
    echo "Unsupported OS for this shell script. Use scripts/bootstrap.ps1 on Windows."
    ;;
esac

./scripts/doctor.sh
