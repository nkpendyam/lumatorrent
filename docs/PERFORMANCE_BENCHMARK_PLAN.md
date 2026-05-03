# Performance Benchmark Plan

## Product performance targets
- App shell interactive: under 1.5s on typical developer laptop.
- Dashboard with 100 torrents: smooth scroll.
- Telemetry updates: no visible jank.
- Memory usage: measured and tracked per release.
- Native engine crash: UI remains recoverable.

## Frontend budgets
- Avoid rerendering all cards on every speed tick.
- Throttle event updates.
- Virtualize long lists.
- Keep expensive diagnostics off render path.
- Respect Reduce Motion.

## Backend budgets
- Engine events batched.
- Logs capped.
- Resume data writes safe and not excessive.
- Heavy verification tasks off UI path.

## Scripts
Use:
- `pnpm bench:budget`
- manual browser devtools profile
- OS resource monitor
