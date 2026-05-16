# Add Torrent Implementation Spec

## Inputs

- Magnet URI.
- `.torrent` file path.
- Drag/drop file.
- Clipboard suggestion with user confirmation.

## Required validation

- Empty input rejection.
- Magnet URI syntax validation.
- `.torrent` extension and metadata parse validation.
- Save path validation.
- Duplicate info hash detection.
- Visible risky-file warning for executable/script-like payload files and archive/disk-image review prompts.

## UI states

- empty
- parsing
- fetching metadata
- metadata ready
- risky file warning
- duplicate
- invalid
- ready to start

## Engine behavior

- For `.torrent`, parse metadata before add.
- For magnet, add pending metadata state.
- Never block UI while metadata is fetched.
- Emit structured events for metadata progress.

## Current native status

- Native libtorrent `POST /v1/torrents/magnet` accepts legal magnets into metadata state and emits `torrent.added`.
- Native libtorrent `POST /v1/torrents/file` imports local `.torrent` metadata, returns the parsed info hash, exposes file paths/sizes, rejects oversized metadata and duplicate info hashes, and emits `torrent.metadata`.
- `pnpm test:engine:native-add-torrent-file` covers this with a deterministic legal multi-file fixture.
