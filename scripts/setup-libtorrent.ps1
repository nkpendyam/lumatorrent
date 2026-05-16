$ErrorActionPreference = "Stop"

Write-Host "Setting up native libtorrent dependencies on Windows"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is required. Install Git for Windows first."
}

if (-not (Get-Command cmake -ErrorAction SilentlyContinue)) {
  throw "CMake is required. Install CMake first."
}

$UserVcpkgRoot = "$env:USERPROFILE\vcpkg"
$VcpkgRoot = $env:LUMATORRENT_VCPKG_ROOT
if (-not $VcpkgRoot) {
  if (Test-Path $UserVcpkgRoot) {
    $VcpkgRoot = $UserVcpkgRoot
  } else {
    $VcpkgRoot = $env:VCPKG_ROOT
  }
}
if (-not $VcpkgRoot) {
  $VcpkgRoot = $UserVcpkgRoot
}

if (-not (Test-Path $VcpkgRoot)) {
  git clone https://github.com/microsoft/vcpkg $VcpkgRoot
  & "$VcpkgRoot\bootstrap-vcpkg.bat"
}

& "$VcpkgRoot\vcpkg.exe" install libtorrent:x64-windows
Write-Host "Set CMAKE_TOOLCHAIN_FILE=$VcpkgRoot\scripts\buildsystems\vcpkg.cmake when configuring native-engine."
