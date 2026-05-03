# Backend Architecture

## Components

```text
Tauri shell
  - windows
  - tray
  - permissions
  - updater later

Engine sidecar
  - torrent session manager
  - diagnostics service
  - safe filesystem service
  - settings service
  - libtorrent adapter later
```

## Sidecar rationale

The engine sidecar isolates native torrent complexity. If libtorrent crashes or deadlocks, the UI can detect the engine failure, restart it, and restore state.

## Sidecar API requirements

- Bind to `127.0.0.1` only.
- Require an auth token.
- Version API under `/v1`.
- Return typed error codes.
- Never expose remote control without explicit user opt-in.

## Future libtorrent adapter

The sidecar owns a trait-like boundary:

```text
TorrentEngine
  add_magnet
  add_torrent_file
  pause
  resume
  remove
  get_status
  diagnose
```

The mock engine implements this first. The libtorrent engine replaces it later behind the same contract.
