#!/usr/bin/env bash
set -euo pipefail
PROFILE="${1:-implement}"
CONFIG=".codex/config.example.toml"

echo "Starting Codex helper."
echo "Profile: ${PROFILE}"
echo "Before continuing, ensure Codex CLI is installed and authenticated in your environment."

echo "Suggested session prompt file: .codex/templates/SESSION_START_PROMPT.md"
echo "Suggested profile docs: .codex/CODEX_HIGH_EFFICIENCY_FEATURES.md"
