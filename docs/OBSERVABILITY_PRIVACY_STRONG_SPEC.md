# Observability and Privacy Strong Spec

## Principle

LumaTorrent should be observable locally without spying on users.

## Defaults

- telemetry off
- crash reporting opt-in
- no content names sent externally by default
- no magnet links uploaded
- no tracker URLs uploaded
- no browsing/search history

## Local diagnostics

Keep local logs for:

- engine lifecycle
- contract errors
- diagnostics decisions
- crash recovery attempts

## Redaction

Logs must redact:

- full file paths when exported unless user chooses otherwise
- magnet links
- info hashes when requested
- tracker URLs when requested

## Export bundle

Provide a future support bundle:

- app version
- OS version
- engine mode
- redacted logs
- diagnostics summary
- no downloaded content
