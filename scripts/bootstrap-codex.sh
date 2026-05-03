#!/usr/bin/env bash
set -euo pipefail

./scripts/bootstrap.sh --install --yes
pnpm install
pnpm verify:structure
pnpm doctor

echo "Codex bootstrap finished. Next task:"
pnpm codex:next
