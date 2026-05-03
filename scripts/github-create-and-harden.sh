#!/usr/bin/env bash
set -euo pipefail
OWNER="${1:-}"
REPO="${2:-lumatorrent}"
VISIBILITY="${3:-public}"
if [[ -z "$OWNER" ]]; then
  echo "Usage: scripts/github-create-and-harden.sh OWNER [REPO] [public|private]"
  exit 2
fi
pnpm github:doctor
pnpm github:init -- --owner "$OWNER" --repo "$REPO" --visibility "$VISIBILITY" --execute
pnpm github:labels -- --owner "$OWNER" --repo "$REPO" --execute
pnpm github:milestones -- --owner "$OWNER" --repo "$REPO" --execute
pnpm github:issues -- --owner "$OWNER" --repo "$REPO" --execute
pnpm github:rules -- --owner "$OWNER" --repo "$REPO" --execute || echo "Ruleset setup failed; check permissions and GitHub plan."
pnpm github:secrets:check
