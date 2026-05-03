# Observability and Diagnostics

LumaTorrent should be private by default. Observability is local-first unless users opt in.

## Local logs

- Engine startup/shutdown events
- Torrent lifecycle events
- Diagnostics run summaries
- Error codes without sensitive file contents
- Crash recovery attempts

## Do not log by default

- Full magnet links
- Complete tracker URLs with private tokens
- User home path if avoidable
- IP addresses unless user enables advanced diagnostic logs

## User-facing diagnostics export

Add a future “Export diagnostic bundle” button that redacts sensitive data and includes app version, OS version, engine version, recent error codes, feature flags, and sanitized settings.

## Optional telemetry policy

No telemetry by default. If added later: explicit opt-in, plain-language explanation, easy disable, public schema, and no torrent names, hashes, tracker URLs, IPs, or file paths.
