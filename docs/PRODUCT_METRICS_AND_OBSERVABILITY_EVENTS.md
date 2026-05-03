# Product Metrics and Observability Events

## Privacy rule
No telemetry by default. All telemetry must be opt-in and documented.

## Local-only events to support diagnostics
- app_started
- engine_started
- engine_crashed
- torrent_added
- metadata_fetch_started
- metadata_fetch_completed
- download_state_changed
- diagnostic_run_started
- diagnostic_cause_detected
- safe_delete_requested
- safe_delete_completed

## Event schema requirements
- event name
- timestamp
- app version
- engine mode
- no raw torrent names by default
- no info hashes in telemetry unless user explicitly exports a diagnostic bundle
