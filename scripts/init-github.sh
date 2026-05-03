#!/usr/bin/env bash
set -euo pipefail
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed. Install it, then rerun."
  exit 1
fi
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial LumaTorrent scaffold"
fi
echo "Creating GitHub repository..."
gh repo create lumatorrent --source=. --public --push
echo "Repository created and pushed."
