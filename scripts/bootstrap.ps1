param(
  [switch]$Install,
  [switch]$Yes
)
$ErrorActionPreference = "Stop"

Write-Host "LumaTorrent bootstrap"
if (-not $Install) {
  Write-Host "Safe check mode. No installs will be performed. Use -Install -Yes to install."
  & "$PSScriptRoot/doctor.ps1"
  exit 0
}

if (-not $Yes) {
  $answer = Read-Host "This may install development dependencies with winget. Continue? [y/N]"
  if ($answer -ne "y" -and $answer -ne "Y") { Write-Host "Cancelled."; exit 0 }
}

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  Write-Host "winget not found. Install App Installer from Microsoft Store, then rerun."
  exit 1
}

$packages = @(
  "Git.Git",
  "OpenJS.NodeJS.LTS",
  "Rustlang.Rustup",
  "Kitware.CMake",
  "Python.Python.3.12"
)

foreach ($pkg in $packages) {
  Write-Host "Installing/checking $pkg"
  winget install --id $pkg --silent --accept-package-agreements --accept-source-agreements -e
}

if (Get-Command corepack -ErrorAction SilentlyContinue) {
  corepack enable
  corepack prepare pnpm@latest --activate
} else {
  npm install -g pnpm
}

& "$PSScriptRoot/doctor.ps1"
