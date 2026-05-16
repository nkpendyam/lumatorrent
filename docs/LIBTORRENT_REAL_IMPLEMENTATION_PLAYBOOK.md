# Libtorrent Real Implementation Playbook

## Why libtorrent

Use libtorrent because it is a mature feature-complete C++ BitTorrent implementation focused on efficiency and scalability.

## Integration architecture

The real engine should run as a sidecar process packaged by Tauri external binaries. UI talks to a narrow contract layer.

## Milestone 1 — Build and link

- install platform dependencies
- build native-engine in stub mode
- add compile-time feature `LUMATORRENT_WITH_LIBTORRENT=ON`
- verify binary launches and prints version

2026-05-15 Windows status:

- CMake `4.3.2`, Ninja `1.13.2`, Visual Studio Build Tools/MSVC, and `libtorrent:x64-windows@2.0.11` are available locally.
- `scripts/setup-libtorrent.ps1` reuses `C:\Users\nkpen\vcpkg` and confirms libtorrent is installed.
- `scripts/build-native-engine.ps1 stub` and `scripts/build-native-engine.ps1 libtorrent` bootstrap the Visual Studio developer environment and pass from a normal PowerShell shell.
- The libtorrent binary starts with `libtorrent mode enabled`; add-magnet still returns the explicit pending response.

## Milestone 2 — Session lifecycle

- create libtorrent session
- configure stable listen port behavior
- enable DHT/PEX/LSD according to settings
- persist session settings

## Milestone 3 — Add magnet

- validate magnet URI
- call async add torrent
- stream metadata progress
- emit metadata timeout if unresolved

2026-05-15 Windows status: `pnpm test:engine:native-add-magnet` builds libtorrent mode, starts the loopback sidecar, verifies invalid magnet rejection, accepts a legal synthetic magnet into metadata state, rejects duplicate info hashes, and verifies `/v1/torrents` reflects the pending metadata record with a stable `files` array. Metadata-received alerts populate file paths and sizes from libtorrent metadata.

## Milestone 4 — Add torrent file

- parse torrent info safely
- reject oversized or malformed files
- respect private torrent flags
- choose save path only after path safety validation

2026-05-15 Windows status: `pnpm test:engine:native-add-torrent-file` writes a deterministic legal multi-file `.torrent` fixture, imports it through native libtorrent `POST /v1/torrents/file`, validates malformed extension rejection, oversized metadata rejection, duplicate info-hash rejection, parsed name/size/files, `torrent.metadata` event payloads, and remove-from-app behavior. Private flag policy and deeper save-path validation remain open.

## Milestone 5 — Progress/events

- translate libtorrent alerts into engine events
- rate-limit high-volume events
- aggregate speed samples
- expose health score inputs

2026-05-15 Windows status: native event snapshots are available at `GET /v1/events`; `torrent.added` is emitted on accepted magnets, and libtorrent add failure, torrent error, metadata received, and state update alerts are mapped into bounded event records when events are requested. Continuous SSE streaming, progress throttling, tracker/DHT diagnostics, and UI subscription behavior remain pending.

## Milestone 6 — Pause/resume/remove

- persist resume data atomically
- test restart recovery
- never delete files from engine without explicit UI intent

2026-05-15 Windows status: `pnpm test:engine:native-add-magnet` verifies native pause, resume, and remove endpoints after adding a legal synthetic magnet. The current implementation removes from the in-memory/session list only; resume-data persistence and explicit file deletion remain separate pending work.

## Milestone 7 — Diagnostics

- tracker status
- DHT state
- port status
- seeder/peer quality
- disk write problems
- queue congestion

## Milestone 8 — Performance hardening

- benchmark many torrents
- bound alert queues
- cap historical telemetry
- avoid UI flooding

## Risks

- C++ dependency packaging
- ABI mismatches
- platform-specific compiler issues
- engine crash recovery
- false diagnostic confidence
