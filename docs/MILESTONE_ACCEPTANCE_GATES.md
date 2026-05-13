# Milestone Acceptance Gates

## M0 — Repo boot and environment

Acceptance:

- `pnpm preflight:local` passes or reports actionable install commands.
- `pnpm verify:v11` passes.
- GitHub repo can be created using dry-run mode.
- Codex mission summary prints.

## M1 — Premium shell UI

Acceptance:

- app shell, sidebar, top bar, dashboard, inspector, settings, safety, diagnostics screens compile.
- all screens have empty/loading/error states.
- reduced-motion behavior exists.
- keyboard navigation smoke tests pass.

## M2 — Contract-complete mock engine

Acceptance:

- OpenAPI-lite contract validates.
- mock engine supports add/list/pause/resume/remove.
- event stream schema validates.
- UI consumes mock engine via one typed client.

## M3 — Safe file handling

Acceptance:

- path traversal blocked.
- absolute paths blocked.
- reserved Windows names handled.
- risky extensions classified.
- delete-to-trash plan implemented or clearly stubbed with safety warnings.

## M4 — Real torrent metadata path

Acceptance:

- `.torrent` file parsing path works or native engine API returns parsed metadata.
- magnet metadata pending state works.
- duplicate info-hash handling exists.
- private torrent flags are respected in data model.

## M5 — Libtorrent sidecar alpha

Acceptance:

- native sidecar builds in stub and libtorrent mode.
- Tauri sidecar config is documented and checked.
- session lifecycle starts/stops cleanly.
- alerts are consumed asynchronously.
- UI never blocks on engine calls.

## M6 — Download lifecycle beta

Acceptance:

- add magnet/download/pause/resume/remove works with legal fixture torrents.
- resume data persists across app restart.
- disk-full and network-drop cases are handled.
- app crash recovery test is documented and partially automated.

## M7 — Download Doctor

Acceptance:

- health score has confidence level.
- diagnoses low seeders, closed port, tracker failure, DHT state, disk pressure, queue congestion.
- claims are phrased probabilistically when signals are weak.
- recommendations map to safe actions.

## M8 — Packaging beta

Acceptance:

- Windows/macOS/Linux dev packages build in CI or documented local runners.
- sidecar binaries included.
- update flow dry-run documented.
- signing secrets are checked but never stored.

## M9 — Public beta readiness

Acceptance:

- release checklist passes.
- security checklist passes.
- accessibility checklist passes.
- telemetry/crash reporting is opt-in or disabled by default.
- beta known-issues doc exists.
