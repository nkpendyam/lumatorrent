# Engine Event Stream Implementation Spec

## Purpose

The UI must not poll every torrent aggressively.

## Event types

- torrent_added
- torrent_removed
- metadata_progress
- progress_tick
- state_changed
- tracker_status
- diagnostic_snapshot
- engine_warning
- engine_error

## Performance rules

- Batch progress ticks.
- Throttle UI updates.
- Persist important state transitions.
- Do not stream raw peer churn to normal dashboard.

## Current implementation status

- Rust mock engine stores a bounded-by-process event snapshot for state events.
- `POST /v1/torrents/magnet` emits `torrent.added`.
- Pause/status changes emit structured state events such as `torrent.paused`.
- `GET /v1/events` returns `{ events: EngineEvent[] }` as a bounded snapshot with `after` and `limit` query support.
- Desktop `EngineClient` has typed `listEvents()` parsing and event reconciliation helpers.
- Native libtorrent mode now exposes `GET /v1/events`, emits `torrent.added` when a legal magnet is accepted, and opportunistically maps libtorrent add/error/metadata alerts into bounded event snapshots when events are read.

Known limitation: this is a snapshot endpoint, not a long-lived server-sent event stream. Real libtorrent alerts still need throttling and UI subscription behavior.
