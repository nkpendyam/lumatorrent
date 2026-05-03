#!/usr/bin/env bash
set -euo pipefail

missing=0
check() {
  if command -v "$1" >/dev/null 2>&1; then
    echo "✅ $1: $(command -v "$1")"
  else
    echo "❌ missing: $1"
    missing=1
  fi
}

echo "LumaTorrent development doctor"
echo "OS: $(uname -s) $(uname -m)"
check git
check node
check pnpm
check rustc
check cargo
check cmake
check python3

if [ "$missing" -eq 1 ]; then
  echo "\nSome tools are missing. Run ./scripts/bootstrap.sh --install --yes to install common dependencies."
  exit 1
fi

echo "\nAll core tools detected."
