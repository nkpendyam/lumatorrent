# Real Engine Milestones

## Principle
The torrent engine must be integrated gradually. Do not jump directly from mock UI to full native torrent behavior.

## Milestone 1 — Engine process lifecycle
- Build stub sidecar.
- Launch sidecar from app.
- Health check works.
- Sidecar exits cleanly.
- Sidecar logs structured messages.
- UI handles sidecar unavailable state.

## Milestone 2 — Secure local API
- Bind to 127.0.0.1 only.
- Random auth token per app launch.
- Reject missing/invalid token.
- Versioned endpoints.
- Contract tests pass.

## Milestone 3 — Mock-complete engine
- List torrents.
- Add mock torrent.
- Pause/resume/remove.
- Event stream.
- Error simulation.

## Milestone 4 — Libtorrent build path
- Install dependencies using platform scripts.
- Build native engine in stub mode.
- Build native engine in libtorrent mode behind flag.
- Document failures.

## Milestone 5 — Metadata fetch
- Magnet metadata fetch.
- Timeout states.
- Duplicate magnet detection.
- User-visible metadata loading state.

## Milestone 6 — First legal download
- Download one known legal torrent.
- Show real progress.
- Pause/resume works.
- Restart resume works.

## Milestone 7 — File selection and priorities
- Show file list.
- Select/deselect files.
- Priority handling.

## Milestone 8 — Diagnostics
- Tracker status.
- DHT status.
- peer/seeder summary.
- port check.
- health score.

## Milestone 9 — Production hardening
- crash recovery.
- resume data validation.
- corrupted state handling.
- disk full handling.
- safe deletion.
