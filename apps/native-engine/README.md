# Native Engine Sidecar

This directory contains the production-oriented native torrent sidecar scaffold.

The project intentionally supports two build modes:

1. **Stub mode**: builds without libtorrent and returns safe placeholder responses.
2. **libtorrent mode**: compiles with `LUMATORRENT_WITH_LIBTORRENT=1` and links against libtorrent.

This prevents Codex from blocking the UI work on native dependency installation while still giving the project a real integration boundary.

## Build stub mode

```bash
cmake -S apps/native-engine -B build/native-engine-stub
cmake --build build/native-engine-stub --config Release
```

On Windows, from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-native-engine.ps1 stub
```

Run the loopback health smoke test:

```powershell
pnpm test:engine:native-health
```

## Build with libtorrent

Install dependencies first:

```bash
./scripts/setup-libtorrent.sh
# or on Windows
powershell -ExecutionPolicy Bypass -File scripts/setup-libtorrent.ps1
```

Then:

```bash
cmake -S apps/native-engine -B build/native-engine-libtorrent -DLUMATORRENT_WITH_LIBTORRENT=ON
cmake --build build/native-engine-libtorrent --config Release
```

On Windows, `scripts/setup-libtorrent.ps1` installs or reuses `libtorrent:x64-windows` through vcpkg. The build script prefers `LUMATORRENT_VCPKG_ROOT` when set, otherwise `C:\Users\<you>\vcpkg`, and only then `VCPKG_ROOT`. This avoids accidentally using Visual Studio's bundled vcpkg checkout from a developer command prompt.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-libtorrent.ps1
powershell -ExecutionPolicy Bypass -File scripts\build-native-engine.ps1 libtorrent
```

Run the libtorrent add-magnet smoke test:

```powershell
pnpm test:engine:native-add-magnet
```

Run the libtorrent `.torrent` import smoke test:

```powershell
pnpm test:engine:native-add-torrent-file
```

That test writes a small legal multi-file `.torrent` fixture locally, imports it through
`POST /v1/torrents/file`, verifies the parsed info hash, and checks the returned file manifest.

Preset build from `apps/native-engine` also works when the toolchain file is supplied:

```powershell
cmake --preset libtorrent-release -DCMAKE_TOOLCHAIN_FILE="$env:USERPROFILE\vcpkg\scripts\buildsystems\vcpkg.cmake"
cmake --build --preset libtorrent-release
```

## API boundary

The native engine must implement the contract in `docs/ENGINE_API.md` and `docs/NATIVE_ENGINE_API.md`.

Do not let frontend code call libtorrent directly.
