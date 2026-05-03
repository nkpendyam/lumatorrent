$ErrorActionPreference = "Stop"
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI (gh) is not installed. Install it, then rerun."
  exit 1
}
if (-not (Test-Path ".git")) {
  git init
  git add .
  git commit -m "Initial LumaTorrent scaffold"
}
Write-Host "Creating GitHub repository..."
gh repo create lumatorrent --source=. --public --push
Write-Host "Repository created and pushed."
