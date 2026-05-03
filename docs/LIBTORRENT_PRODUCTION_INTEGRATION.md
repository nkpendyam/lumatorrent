# libtorrent Production Integration Plan

## Why libtorrent

The project uses libtorrent because the BitTorrent protocol stack is complex: tracker communication, DHT, peer wire protocol, choking/unchoking, piece verification, resume data, rate limiting, encryption, and private torrent behavior should not be reimplemented from scratch in v1.

## Integration strategy

Use a native sidecar process instead of linking libtorrent directly into the Tauri process.

Benefits:

- Engine crash isolation
- Cleaner security boundary
- Easier debugging
- Native dependency complexity isolated from the UI
- Ability to keep mock/stub engine for frontend development

## Milestones

### NATIVE-001: Build stub sidecar

- Compile `apps/native-engine` without libtorrent.
- Launch from terminal.
- Enforce loopback binding and token requirement.

### NATIVE-002: Add local IPC/HTTP server

- Implement `/v1/health`.
- Add token middleware.
- Add structured JSON errors.

### NATIVE-003: Compile with libtorrent

- Install libtorrent using package manager or vcpkg.
- Enable `-DLUMATORRENT_WITH_LIBTORRENT=ON`.
- Verify process starts and returns `engine: libtorrent`.

### NATIVE-004: Add magnet support

- Parse magnet URI.
- Validate save path.
- Add torrent to session.
- Return stable torrent id.
- Emit metadata status.

### NATIVE-005: Persistence and crash recovery

- Save resume data periodically.
- Restore session on startup.
- Atomic writes only.
- Simulate kill/restart in tests.

### NATIVE-006: Download Doctor data

Expose:

- tracker status
- DHT status
- port status
- peer/seeder count
- speed trend
- disk status

### NATIVE-007: Private torrent correctness

- Respect private torrent flag.
- Disable DHT/PEX where required.
- Avoid leaking private torrent metadata to public discovery networks.

## Definition of done for libtorrent integration

- Native sidecar works on one OS with a legal test torrent.
- App can add, pause, resume, remove, restart, and recover.
- No non-loopback bind.
- Remove-with-delete requires explicit UI confirmation.
- Integration tests documented and at least partially automated.
