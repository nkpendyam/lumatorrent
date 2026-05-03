# Codex Task Queue

Work in order. Do not skip safety tasks.

## Phase 0 — Repository hardening

- [ ] Run `pnpm doctor` and record missing dependencies.
- [ ] Run `node scripts/verify-project.mjs`.
- [ ] Replace placeholder GitHub org names.
- [ ] Generate `pnpm-lock.yaml` by running `pnpm install`.
- [ ] Confirm `pnpm verify` passes.

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
- [ ] Add ADR for chosen libtorrent binding/sidecar strategy.
- [ ] Add build docs for native libtorrent dependencies.
- [ ] Implement first libtorrent spike in a separate branch.

## Phase 6 — packaging and releases

- [ ] Add release dry-run artifacts.
- [ ] Add changelog process.
- [ ] Add installer QA checklist.
- [ ] Add signing/notarization documentation.
