# Real libtorrent Implementation Tasks

## Milestone NATIVE-001 — Compile stub engine everywhere
- Build native engine with CMake on Windows/macOS/Linux.
- Run contract smoke test.
- Bundle stub engine as Tauri sidecar.

## Milestone NATIVE-002 — HTTP/IPC loopback server
- Implement loopback-only server.
- Require token auth.
- Add `/health` and `/v1/torrents` endpoints.
- Add contract tests.

## Milestone NATIVE-003 — libtorrent session lifecycle
- Create session.
- Configure alert categories intentionally.
- Load/save session state.
- Start DHT, LSD, UPnP/NAT-PMP only according to settings.
- Add shutdown path.

## Milestone NATIVE-004 — add magnet / add torrent
- Parse magnet URI.
- Add torrent params safely.
- Validate save path.
- Respect private torrent flags.
- Emit metadata/loading events.

## Milestone NATIVE-005 — progress and events
- Map libtorrent alerts to internal events.
- Emit progress snapshots at throttled intervals.
- Add speed moving averages.
- Add ETA smoothing.

## Milestone NATIVE-006 — pause/resume/remove
- Pause and resume reliably.
- Save resume data.
- Remove from session.
- Implement safe file delete separately.

## Milestone NATIVE-007 — Download Doctor real diagnostics
- Tracker health.
- DHT status.
- Port status.
- Seeder/peer availability.
- Disk speed/free space.
- VPN/proxy detection as compatibility hints, not anonymity claims.

## Milestone NATIVE-008 — stress and recovery
- Crash/restart recovery.
- 100 torrent list simulation.
- Many-small-files torrent.
- Huge-file torrent.
- Network drop and resume.
