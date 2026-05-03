param([switch]$Yes)
$ErrorActionPreference = "Stop"
./scripts/bootstrap.ps1 -Install -Yes
pnpm install
pnpm verify:structure
pnpm doctor
Write-Output "Codex bootstrap finished. Next task:"
pnpm codex:next
