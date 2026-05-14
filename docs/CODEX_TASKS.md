# Codex Task Queue

Work in order. Do not skip safety tasks.

## Phase 0 — Repository hardening

- [x] Run `pnpm doctor` and record missing dependencies.
  - 2026-05-13 audit: `git`, `node`, `pnpm`, `rustc`, `cargo`, and authenticated `gh` are available through the project scripts. `cmake` is still missing and blocks native-engine build verification. Production doctor also reports optional `ninja` and `pkg-config` missing.
- [x] Run `node scripts/verify-project.mjs`.
- [x] Replace placeholder GitHub org names.
  - 2026-05-13 audit: remote is `nkpendyam/lumatorrent`; repository metadata, CODEOWNERS, and repo automation runbooks now use `nkpendyam`.
- [x] Generate `pnpm-lock.yaml` by running `pnpm install`.
  - 2026-05-13 audit: `pnpm install` updated `pnpm-lock.yaml`; `pnpm install --frozen-lockfile` now passes.
- [ ] Confirm `pnpm verify` passes.
  - 2026-05-14 branch status: `codex/verify-format-sweep` (`f714a06`) reports full `pnpm verify` passing after a formatting-only sweep. Main has not merged this branch yet.

## Active Codex Branches

- [ ] Review/merge `codex/verify-format-sweep` (`f714a06`) — Prettier sweep, full `pnpm verify` reported passing, 196 changed files.
- [ ] Review/merge `codex/safe-delete-to-trash` (`1cd4e2b`) — safe delete preview model and desktop trash adapter boundary; real OS trash integration still pending.
- [ ] Review/merge `codex/magnet-metadata-state` (`c199ce8`) — magnet metadata state contract and mock-engine transitions; real libtorrent metadata fetch still pending.
- [ ] Review/merge `codex/native-engine-health` (`0339216`) — native health contract smoke readiness; blocked from CMake verification until `cmake` is installed.

## Phase 1 — UI foundation

- [ ] Add shared Button/Card/Badge primitives.
- [ ] Replace hardcoded dashboard primitives with shared components.
- [ ] Add empty dashboard state.
- [ ] Add reduce-motion hook.
- [ ] Add keyboard accessible Add Torrent modal.
- [ ] Add command palette shell.

## Phase 2 — Engine API foundation

- [ ] Implement `/v1/torrents` mock endpoint.
- [ ] Implement `/v1/torrents/add` mock endpoint with validation.
- [ ] Implement `/v1/torrents/:id/pause` mock endpoint.
- [ ] Implement `/v1/torrents/:id/resume` mock endpoint.
- [ ] Implement `/v1/torrents/:id/diagnostics` mock endpoint.
- [ ] Add auth token validation middleware.

## Phase 3 — Safety foundation

- [ ] Add Rust path safety module.
- [ ] Add malicious filename fixture tests.
- [ ] Add delete preview model.
  - 2026-05-14 branch status: implemented on `codex/safe-delete-to-trash` (`1cd4e2b`), not merged to main.
- [ ] Add risky file classifier.
- [ ] Add UI warning for executable/script files.

## Phase 4 — Download Doctor

- [ ] Define health score algorithm v0.
- [ ] Add confidence level.
- [ ] Add port status placeholder.
- [ ] Add tracker status placeholder.
- [ ] Add DHT status placeholder.
- [ ] Add action recommendations.

## Phase 5 — libtorrent preparation

- [ ] Create engine trait boundary.
- [ ] Implement mock engine behind the trait.
- [ ] Add magnet metadata state machine.
  - 2026-05-14 branch status: implemented on `codex/magnet-metadata-state` (`c199ce8`), not merged to main.
- [ ] Add ADR for chosen libtorrent binding/sidecar strategy.
- [ ] Add build docs for native libtorrent dependencies.
- [ ] Implement first libtorrent spike in a separate branch.
  - 2026-05-14 branch status: native health smoke readiness exists on `codex/native-engine-health` (`0339216`), but CMake is still missing.

## Phase 6 — packaging and releases

- [ ] Add release dry-run artifacts.
- [ ] Add changelog process.
- [ ] Add installer QA checklist.
- [ ] Add signing/notarization documentation.
