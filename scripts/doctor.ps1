$ErrorActionPreference = "Stop"
$missing = $false
function Check($name) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd) { Write-Host "✅ $name: $($cmd.Source)" }
  else { Write-Host "❌ missing: $name"; $script:missing = $true }
}
Write-Host "LumaTorrent development doctor"
Check git
Check node
Check pnpm
Check rustc
Check cargo
Check cmake
Check python
if ($missing) {
  Write-Host "`nSome tools are missing. Run ./scripts/bootstrap.ps1 -Install -Yes to install common dependencies."
  exit 1
}
Write-Host "`nAll core tools detected."
