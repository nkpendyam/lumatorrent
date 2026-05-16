param(
  [ValidateSet("stub", "libtorrent")]
  [string]$Mode = "stub",
  [switch]$SkipVsDevShell
)

$ErrorActionPreference = "Stop"

function Find-VsDevCmd {
  $VsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
  if (Test-Path $VsWhere) {
    $InstallPath = & $VsWhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    if ($LASTEXITCODE -eq 0 -and $InstallPath) {
      $Candidate = Join-Path $InstallPath "Common7\Tools\VsDevCmd.bat"
      if (Test-Path $Candidate) {
        return $Candidate
      }
    }
  }

  $Candidates = @(
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Professional\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\Professional\Common7\Tools\VsDevCmd.bat",
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path $Candidate) {
      return $Candidate
    }
  }

  return $null
}

$RunningOnWindows = ($env:OS -eq "Windows_NT") -or ($IsWindows -eq $true)

if ($RunningOnWindows -and -not $SkipVsDevShell -and -not $env:VSCMD_VER) {
  $VsDevCmd = Find-VsDevCmd
  if ($VsDevCmd) {
    $PowerShellExe = (Get-Process -Id $PID).Path
    $Command = "call `"$VsDevCmd`" -no_logo -arch=x64 -host_arch=x64 && `"$PowerShellExe`" -NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" -Mode $Mode -SkipVsDevShell"
    cmd.exe /d /s /c $Command
    if ($LASTEXITCODE -ne 0) {
      throw "Native engine build failed in Visual Studio developer environment with exit code $LASTEXITCODE."
    }
    exit 0
  }

  Write-Warning "Visual Studio developer environment was not found. Continuing with the current shell environment."
}

$BuildDir = "build/native-engine-$Mode"
$CmakeArgs = @("-S", "apps/native-engine", "-B", $BuildDir, "-G", "Ninja")

if ($Mode -eq "libtorrent") {
  $CmakeArgs += "-DLUMATORRENT_WITH_LIBTORRENT=ON"
  $UserVcpkgRoot = "$env:USERPROFILE\vcpkg"
  $VcpkgRoot = $env:LUMATORRENT_VCPKG_ROOT
  if (-not $VcpkgRoot) {
    if (Test-Path $UserVcpkgRoot) {
      $VcpkgRoot = $UserVcpkgRoot
    } else {
      $VcpkgRoot = $env:VCPKG_ROOT
    }
  }
  $VcpkgToolchainFile = "$VcpkgRoot\scripts\buildsystems\vcpkg.cmake"
  if (-not (Test-Path $VcpkgToolchainFile)) {
    throw "vcpkg toolchain not found at $VcpkgToolchainFile. Run scripts\setup-libtorrent.ps1 first."
  }
  $CmakeArgs += "-DCMAKE_TOOLCHAIN_FILE=$VcpkgToolchainFile"
} else {
  $CmakeArgs += "-DLUMATORRENT_WITH_LIBTORRENT=OFF"
}

cmake @CmakeArgs
if ($LASTEXITCODE -ne 0) {
  throw "CMake configure failed with exit code $LASTEXITCODE."
}

cmake --build $BuildDir --config Release
if ($LASTEXITCODE -ne 0) {
  throw "CMake build failed with exit code $LASTEXITCODE."
}

Write-Host "Native engine built at $BuildDir"
