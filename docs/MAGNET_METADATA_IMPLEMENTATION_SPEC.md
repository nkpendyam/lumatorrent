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
