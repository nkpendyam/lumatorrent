# Final Engine Implementation Playbook

## Architecture

Use a sidecar engine process. The UI must never directly block on torrent engine operations.

```text
Tauri UI
  ↓ IPC/local API
Rust controller / local API
  ↓ FFI or native bridge
libtorrent sidecar
```

## Non-negotiables

- Engine binds localhost only.
- API requires local auth token.
- Sidecar permissions are explicit.
- Engine emits events.
- UI consumes throttled state updates.
- Long-running operations are asynchronous.
- Resume state is durable.
- Crash recovery is tested.

## Milestones

### Engine-0 Contract only
Mock engine passes schema validation.

### Engine-1 Sidecar health
Tauri starts/stops sidecar and reads `/health`.

### Engine-2 Add torrent shell
Input validation and lifecycle state exist.

### Engine-3 Real libtorrent add
Legal test torrent downloads.

### Engine-4 Pause/resume/remove
Lifecycle verified.

### Engine-5 Resume data
Restart app and continue.

### Engine-6 Diagnostics signals
Expose tracker/DHT/peer/port/disk signals.

### Engine-7 Hardening
Stress test with many files and unstable network.

## UI event contract

Emit:
- engine.health
- torrent.added
- torrent.metadata
- torrent.progress
- torrent.completed
- torrent.error
- diagnostics.updated
- engine.crashed
- engine.restarted
