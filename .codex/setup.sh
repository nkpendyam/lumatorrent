#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[setup] LumaTorrent Codex environment setup"

if ! command -v node >/dev/null 2>&1; then
  echo "[setup] Node.js is missing. Install Node.js 22 LTS or newer, then rerun."
  exit 1
fi

if ! command -v corepack >/dev/null 2>&1; then
  echo "[setup] corepack is missing. Install a recent Node.js distribution."
  exit 1
fi

corepack enable
corepack prepare pnpm@latest --activate

if ! command -v rustup >/dev/null 2>&1; then
  echo "[setup] rustup is missing. Install Rust from rustup.rs, then rerun."
  exit 1
fi

rustup show >/dev/null

if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile || pnpm install
fi

echo "[setup] Done. Next: pnpm run doctor && pnpm run verify"
