# Implementation Backlog

## P0 — Must happen before real torrent downloads

- Fix all package scripts.
- Verify project structure.
- Implement design tokens.
- Implement engine API contract tests.
- Implement safe path normalization tests.
- Implement Add Torrent flow with mock engine.
- Implement remove/delete confirmation UX.
- Implement feature flag checks.
- Add CI gate for tests.

## P1 — Real MVP

- Native sidecar process stub launched by Tauri.
- Engine health check from UI.
- Magnet metadata fetch using native engine.
- `.torrent` file import.
- Start/pause/resume/remove.
- Persist torrent state.
- Resume after app restart.
- Safe delete to trash.
- Legal torrent fixture tests.

## P2 — Premium UX

- Full dashboard states.
- Inspector drawer.
- Download Doctor v1.
- Settings v1.
- Command palette.
- Compact table view.
- Polished animations.
- Accessibility tests.

## P3 — Power user

- Tracker editor.
- Peer list.
- Ratio controls.
- Bandwidth profiles.
- Private torrent handling.
- Force recheck.
- Force announce.

## P4 — Production readiness

- Signed packaging.
- Auto-update path.
- Crash recovery.
- Security audit.
- Performance benchmarks.
- Beta telemetry decision.
- Localization framework.
- Docs site.

## P5 — Post-v1

- Browser extension.
- Remote dashboard with explicit opt-in.
- Mobile companion.
- Plugin SDK.
