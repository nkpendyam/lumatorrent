# Libtorrent Real Implementation Playbook

## Why libtorrent

Use libtorrent because it is a mature feature-complete C++ BitTorrent implementation focused on efficiency and scalability.

## Integration architecture

The real engine should run as a sidecar process packaged by Tauri external binaries. UI talks to a narrow contract layer.

## Milestone 1 — Build and link

- install platform dependencies
- build native-engine in stub mode
- add compile-time feature `LUMATORRENT_ENGINE_MODE=libtorrent`
- verify binary launches and prints version

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

## Milestone 4 — Add torrent file

- parse torrent info safely
- reject oversized or malformed files
- respect private torrent flags
- choose save path only after path safety validation

## Milestone 5 — Progress/events

- translate libtorrent alerts into engine events
- rate-limit high-volume events
- aggregate speed samples
- expose health score inputs

## Milestone 6 — Pause/resume/remove

- persist resume data atomically
- test restart recovery
- never delete files from engine without explicit UI intent

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
