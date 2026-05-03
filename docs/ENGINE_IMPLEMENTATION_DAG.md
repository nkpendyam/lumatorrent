# Engine Implementation DAG

## Critical path
1. Define API contracts
2. Implement localhost auth middleware
3. Implement engine event bus
4. Implement sidecar spawn from Tauri
5. Implement native engine health endpoint
6. Implement libtorrent session initialization
7. Implement async add torrent
8. Implement alerts to event stream
9. Implement status aggregation without blocking UI
10. Implement resume data and crash recovery
11. Implement pause/resume/remove
12. Implement diagnostics

## Hard rules from libtorrent integration
- Avoid blocking `status()` calls on UI paths.
- Prefer `post_status()` and `post_torrent_updates()` for updates.
- Prefer async add flow where possible.
- All engine state changes must emit structured events.
- UI should consume event stream snapshots, not poll aggressively.

## Done means
- contract tests pass
- engine smoke tests pass
- no renderer thread blocked by engine work
- engine crash does not crash UI
- restart restores previous torrents
