# Torrent Engine Integration Plan

## Goal

Use libtorrent/rasterbar as the native torrent engine without polluting the UI with protocol concerns.

## Recommended path

### Stage 1: Mock engine

Build the full UI against a mock adapter.

Purpose:

- Validate UX.
- Build tests.
- Prevent torrent complexity from blocking product design.

### Stage 2: Local sidecar protocol

Create an engine process with JSON-RPC over stdio or localhost HTTP.

Endpoints:

```text
POST /torrents/magnet
POST /torrents/file
POST /torrents/:id/pause
POST /torrents/:id/resume
POST /torrents/:id/remove
GET  /torrents
GET  /torrents/:id
POST /torrents/:id/diagnose
```

### Stage 3: libtorrent backend

Implement engine commands with libtorrent.

Core features:

- Session creation.
- Magnet add.
- Torrent file add.
- Resume data.
- DHT/PEX/LSD settings.
- Tracker status.
- Peer statistics.
- File priority.
- Sequential download toggle.
- Recheck.
- Force announce.

### Stage 4: crash recovery

- Engine heartbeat.
- UI detects engine stop.
- UI restarts engine.
- Engine reloads session.
- UI shows recovery banner.

## Integration risks

- C++ build complexity.
- Dynamic library packaging.
- OpenSSL/lib dependencies.
- Windows MSVC issues.
- macOS signing/notarization.
- Linux distro library differences.

## Mitigation

- Keep engine isolated.
- Use reproducible builds.
- Build in CI early.
- Start with one OS target first.
- Add platform smoke tests.
