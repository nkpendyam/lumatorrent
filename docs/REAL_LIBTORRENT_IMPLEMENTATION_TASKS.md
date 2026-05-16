# Real libtorrent Implementation Tasks

## Milestone NATIVE-001 — Compile stub engine everywhere

- Build native engine with CMake on Windows/macOS/Linux.
- Run contract smoke test.
- Bundle stub engine as Tauri sidecar.

2026-05-15 local Windows status: CMake/Ninja/MSVC are installed and `scripts/build-native-engine.ps1 stub` builds successfully. macOS/Linux builds and Tauri bundling remain open.

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

2026-05-15 local Windows status: `libtorrent:x64-windows@2.0.11` is installed through vcpkg, the native engine builds with `LUMATORRENT_WITH_LIBTORRENT=ON`, constructs an `lt::session`, and launches in libtorrent mode. Session settings, alert categories, persistence, and shutdown semantics remain open.

## Milestone NATIVE-004 — add magnet / add torrent

- Parse magnet URI.
- Add torrent params safely.
- Validate save path.
- Respect private torrent flags.
- Emit metadata/loading events.

2026-05-15 local Windows status: native libtorrent mode accepts a legal magnet through `POST /v1/torrents/magnet`, validates invalid magnets, rejects duplicate info hashes, calls `async_add_torrent`, returns metadata status, and lists the accepted torrent. Native libtorrent mode also accepts deterministic local `.torrent` fixtures through `POST /v1/torrents/file`, rejects oversized metadata, parses name/size/files, rejects duplicates, emits metadata events, and proves file-list behavior without public network dependency. Private flag policy and save-path hardening remain open.

## Milestone NATIVE-005 — progress and events

- Map libtorrent alerts to internal events.
- Emit progress snapshots at throttled intervals.
- Add speed moving averages.
- Add ETA smoothing.

2026-05-15 local Windows status: native event snapshots are wired for accepted magnets plus initial libtorrent add/error/metadata/state-update alerts. State updates map progress, payload speeds, seeders, peers, and total wanted size into the native torrent snapshot. Speed moving averages, ETA smoothing, and long-lived UI event subscription remain open.

## Milestone NATIVE-006 — pause/resume/remove

- Pause and resume reliably.
- Save resume data.
- Remove from session.
- Implement safe file delete separately.

2026-05-15 local Windows status: native loopback endpoints for pause, resume, and remove are wired for accepted libtorrent magnets; the smoke test verifies status transitions and remove-from-app behavior. Resume data persistence, crash recovery, and safe file deletion from real metadata remain open.

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
