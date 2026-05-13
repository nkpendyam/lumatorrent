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
