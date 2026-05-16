# Magnet Metadata Implementation Spec

## State machine

`idle -> validating -> adding -> fetching_metadata -> metadata_ready -> downloading`

Error states:

- invalid_magnet
- duplicate_torrent
- metadata_timeout
- no_peers_found
- engine_unavailable

## UX requirements

- Show `Fetching torrent information` not `stuck at 0%`.
- Allow cancel.
- Show elapsed time.
- Show DHT/tracker hints only in details.

## Backend requirements

- Use async add path where possible.
- Avoid blocking UI-thread calls.
- Persist pending state safely.
- Normalize `xt=urn:btih:` values case-insensitively.
- Reject duplicate info hashes with `DUPLICATE_TORRENT` before creating another torrent row.

## Current implementation status

- Shared contract exposes optional `TorrentSummary.infoHash`.
- Shared contract and engine error schema include `DUPLICATE_TORRENT`.
- Desktop mock client rejects duplicate magnet info hashes.
- Rust mock engine rejects duplicate magnet info hashes.
- Native libtorrent mode accepts magnets into metadata state, exposes a `files` array on torrent snapshots, and fills that array from libtorrent `metadata_received_alert` when metadata becomes available.
- Native libtorrent mode also accepts local `.torrent` files and immediately fills parsed file metadata from libtorrent `torrent_info`.

Known limitation: live magnet metadata proof with real peers is still pending. Duplicate detection currently uses magnet URI info hashes that are present at add time; post-metadata duplicate detection for hybrid/v2 torrents still needs hardening.

## `.torrent` parser status

- Rust engine now has a bencode metadata parser for local `.torrent` files.
- Parser extracts torrent name, files, total size, private flag, and SHA-1 info hash.
- Parser validates torrent-owned file paths before they can enter the engine manifest.
- `/v1/torrents/file` accepts a local `.torrent` path, parses metadata, rejects duplicate info hashes, and inserts the torrent into the mock engine boundary.
- Native libtorrent `/v1/torrents/file` accepts a deterministic legal `.torrent` fixture, returns the parsed v1 info hash, exposes parsed file paths/sizes in `/v1/torrents`, and emits `torrent.metadata`.

Known limitation: native `.torrent` import still needs private flag handling, stronger save-path validation, resume data, and UI file picker end-to-end coverage.
