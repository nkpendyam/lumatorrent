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

## API boundary

The native engine must implement the contract in `docs/ENGINE_API.md` and `docs/NATIVE_ENGINE_API.md`.

Do not let frontend code call libtorrent directly.
