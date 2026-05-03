# Implementation Plan

## Milestone 0 — Foundation

- Create monorepo.
- Add strict TypeScript.
- Add lint/format/test scripts.
- Add CI.
- Add docs.
- Add mock engine.

## Milestone 1 — Premium shell

- App shell with sidebar and top bar.
- Download card component.
- Empty state.
- Add torrent modal.
- Mock downloads.
- Dark/light/system theme.
- Smooth transitions.

## Milestone 2 — Download lifecycle

- Add magnet to mock engine.
- Pause/resume/remove.
- Persist mock downloads.
- Details drawer.
- File list.
- Safe remove dialog.

## Milestone 3 — Download Doctor

- Health score calculation.
- Diagnostic causes.
- Human-readable recommendations.
- Port check placeholder.
- Tracker/DHT status placeholder.
- Slow-speed copy.

## Milestone 4 — Engine sidecar

- Define JSON-RPC or HTTP protocol.
- Start/stop sidecar from Tauri.
- Heartbeat.
- Engine crash recovery UI.
- Mock sidecar tests.

## Milestone 5 — libtorrent integration

- Create native engine prototype.
- Add one legal magnet download.
- Save resume data.
- Pause/resume.
- Tracker status.
- DHT status.
- File priorities.

## Milestone 6 — Production readiness

- Packaging per OS.
- Signed installers.
- Auto-update strategy.
- Accessibility pass.
- Performance testing with 100+ torrents.
- Security review.
- Public beta.
