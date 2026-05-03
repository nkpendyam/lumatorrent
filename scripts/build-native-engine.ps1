param(
  [ValidateSet("stub", "libtorrent")]
  [string]$Mode = "stub"
)

$ErrorActionPreference = "Stop"
$BuildDir = "build/native-engine-$Mode"
$Args = @("-S", "apps/native-engine", "-B", $BuildDir)

if ($Mode -eq "libtorrent") {
  $Args += "-DLUMATORRENT_WITH_LIBTORRENT=ON"
  if ($env:VCPKG_ROOT) {
    $Args += "-DCMAKE_TOOLCHAIN_FILE=$env:VCPKG_ROOT\scripts\buildsystems\vcpkg.cmake"
  }
} else {
  $Args += "-DLUMATORRENT_WITH_LIBTORRENT=OFF"
}

cmake @Args
cmake --build $BuildDir --config Release
Write-Host "Native engine built at $BuildDir"
