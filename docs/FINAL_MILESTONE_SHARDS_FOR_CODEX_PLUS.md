# Final Milestone Shards for Codex Plus

## Why sharding matters

A Plus plan should not be spent on one huge "build everything" task. Split work into small sessions so Codex uses less context and produces reviewable diffs.

## Shards

### M0 — Preflight and repo hygiene

Goal: ensure the repo installs, scripts work, and docs are consistent.

Commands:

```bash
pnpm preflight:plus
pnpm scripts:check
pnpm verify:v14
```

Exit:

- no broken package scripts
- final handoff docs present
- audit scripts pass

### M1 — Design tokens and app shell

Goal: implement a premium UI foundation.

Files:

- design token CSS
- AppShell
- Sidebar
- TopBar
- theme variables
- motion constants

Exit:

- dark/light mode works
- reduced motion handled
- component tests pass

### M2 — Dashboard

Goal: polished mock dashboard.

Exit:

- download cards
- compact table mode
- empty states
- status badges
- no janky animation

### M3 — Settings persistence

Goal: durable, typed settings.

Exit:

- schema validation
- safe defaults
- migration test
- reset behavior

### M4 — Engine API contract hardening

Goal: stable contract before real engine.

Exit:

- schemas validate
- mock engine implements contract
- event stream contract tested

### M5 — File safety

Goal: safe paths and safe deletion.

Exit:

- path traversal blocked
- dangerous filenames handled
- delete-to-trash abstraction designed
- no parent-folder blind delete

### M6 — Native sidecar spike

Goal: prove Tauri can spawn/monitor the engine.

Exit:

- sidecar starts
- health endpoint works
- engine crash handled
- frontend shows engine state

### M7 — Real torrent import

Goal: `.torrent` and magnet input pipeline.

Exit:

- validation
- metadata states
- duplicate detection
- error states

### M8 — Real lifecycle

Goal: add/pause/resume/remove.

Exit:

- lifecycle tests
- restart recovery
- resume state

### M9 — Download Doctor

Goal: real diagnostics.

Exit:

- low seeder cause
- port status
- tracker/DHT status
- disk warning
- confidence score

### M10 — Packaging and QA

Goal: distributable beta.

Exit:

- Windows/macOS/Linux package smoke-tested
- release notes
- known issues
