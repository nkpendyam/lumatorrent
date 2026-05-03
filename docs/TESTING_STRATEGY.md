# Testing Strategy

## Test pyramid

1. Unit tests: formatting, health score, diagnostics, path safety.
2. Component tests: cards, modals, settings, safe delete dialog.
3. Integration tests: mock engine lifecycle.
4. E2E tests: add magnet, diagnose, pause/resume, remove safely.
5. Release smoke tests: installers and app restart.

## Required test cases

- Healthy torrent.
- Dead torrent.
- Magnet metadata pending.
- Private torrent behavior.
- Many small files.
- Huge file.
- Unicode filenames.
- Dangerous paths.
- Disk full simulation.
- Network disconnect simulation.
- Engine crash/restart.

## Performance targets

- Dashboard remains smooth with 100 torrents.
- Status updates throttled to 250–500ms.
- No unbounded speed history.
- Details drawer opens under 100ms on normal hardware.

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
cargo test --manifest-path apps/engine/Cargo.toml
```
