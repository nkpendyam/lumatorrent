# LumaTorrent Engine

This folder is the future torrent engine sidecar.

## Current state

The first milestone should use the frontend mock engine. Do not rush native libtorrent integration until the UI contracts are stable.

## Future implementation options

1. Rust sidecar with C++ libtorrent FFI.
2. C++ sidecar exposing JSON-RPC.
3. Rust controller spawning libtorrent wrapper process.

## Required engine behaviors

- Add magnet.
- Add torrent file.
- Pause/resume/remove.
- Save resume data.
- Return status snapshots.
- Emit throttled status events.
- Diagnose speed causes.
- Validate paths.
- Respect private torrent flags.
