#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile || pnpm install
pnpm lint
pnpm test
pnpm build
pnpm --filter @lumatorrent/desktop tauri build --debug
