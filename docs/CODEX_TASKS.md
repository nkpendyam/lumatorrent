# Codex Task Queue

Work in order. Do not skip safety tasks.

## Phase 0 — Repository hardening

- [x] Run `pnpm doctor` and record missing dependencies.
  - 2026-05-13 audit: `git`, `node`, `pnpm`, `rustc`, `cargo`, and authenticated `gh` are available through the project scripts. `cmake` is still missing and blocks native-engine build verification. Production doctor also reports optional `ninja` and `pkg-config` missing.
  - 2026-05-15 local update: CMake `4.3.2` and Ninja `1.13.2` are now installed through winget. Visual Studio Build Tools/MSVC were already available through `VsDevCmd.bat`. `libtorrent:x64-windows@2.0.11` is installed through `C:\Users\nkpen\vcpkg`.
- [x] Run `node scripts/verify-project.mjs`.
- [x] Replace placeholder GitHub org names.
  - 2026-05-13 audit: remote is `nkpendyam/lumatorrent`; repository metadata, CODEOWNERS, and repo automation runbooks now use `nkpendyam`.
- [x] Generate `pnpm-lock.yaml` by running `pnpm install`.
  - 2026-05-13 audit: `pnpm install` updated `pnpm-lock.yaml`; `pnpm install --frozen-lockfile` now passes.
- [x] Confirm `pnpm verify` passes.
  - 2026-05-14 branch status: `codex/verify-format-sweep` (`f714a06`) reports full `pnpm verify` passing after a formatting-only sweep. Main has not merged this branch yet.
  - 2026-05-14 local status: `pnpm verify` passes after the formatting sweep and safe-delete engine alpha.

## Active Codex Branches

- [ ] Review/merge `codex/verify-format-sweep` (`f714a06`) — Prettier sweep, full `pnpm verify` reported passing, 196 changed files.
- [ ] Review/merge `codex/safe-delete-to-trash` (`1cd4e2b`) — safe delete preview model and desktop trash adapter boundary; real OS trash integration still pending.
  - 2026-05-15 local status: main dirty worktree contains a safe delete-to-trash engine boundary with targeted Rust/shared/desktop tests and contract validation passing. Review the local diff before merging or replaying the branch.
- [ ] Review/merge `codex/magnet-metadata-state` (`c199ce8`) — magnet metadata state contract and mock-engine transitions; real libtorrent metadata fetch still pending.
- [ ] Review/merge `codex/native-engine-health` (`0339216`) — native health contract smoke readiness.
  - 2026-05-15 local update: CMake verification is no longer blocked. Stub and libtorrent native builds pass locally on Windows.

## Phase 1 — UI foundation

- [ ] Add shared Button/Card/Badge primitives.
- [ ] Replace hardcoded dashboard primitives with shared components.
- [ ] Add empty dashboard state.
- [ ] Add reduce-motion hook.
- [ ] Add keyboard accessible Add Torrent modal.
- [ ] Add command palette shell.

## Phase 2 — Engine API foundation

- [ ] Implement `/v1/torrents` mock endpoint.
- [x] Implement `/v1/torrents/file` mock endpoint with validation.
  - 2026-05-15 local status: Rust engine parses local `.torrent` files, validates file paths, computes info hash, rejects duplicate hashes, and adds parsed file manifests to the mock engine boundary. Desktop engine clients expose `addTorrentFile()`.
- [ ] Implement `/v1/torrents/:id/pause` mock endpoint.
- [ ] Implement `/v1/torrents/:id/resume` mock endpoint.
- [ ] Implement `/v1/torrents/:id/diagnostics` mock endpoint.
- [ ] Add auth token validation middleware.

## Phase 3 — Safety foundation

- [x] Add Rust path safety module.
  - 2026-05-15 local status: Rust engine path safety rejects traversal, absolute paths, drive prefixes, repeated separators, reserved Windows names, trailing dot/space segments, and leading/trailing whitespace.
- [x] Add malicious filename fixture tests.
  - 2026-05-15 local status: shared TypeScript and Rust engine validators both consume `tests/fixtures/path-safety-cases.json`; fixtures cover traversal, absolute paths, repeated separators, reserved Windows names, trailing dot/space segments, and risky file names.
- [ ] Add delete preview model.
  - 2026-05-14 branch status: implemented on `codex/safe-delete-to-trash` (`1cd4e2b`), not merged to main.
- [x] Add engine safe delete-to-trash boundary.
  - 2026-05-14 local status: `POST /v1/torrents/:id/remove` now supports remove-only by default and manifest-gated trash mode through the Rust `trash` crate. OS-specific QA evidence and visible file preview UI are still pending.
- [x] Add Windows OS trash smoke evidence.
  - 2026-05-15 local status: `pnpm test:engine:trash-smoke` passed on Windows 11 Home Single Language 10.0.26200, 64-bit. macOS and Linux trash smoke evidence remains pending.
- [x] Add risky file classifier.
- [x] Add UI warning for executable/script files.
  - 2026-05-15 local status: Add Torrent modal shows the highest-risk selected or pasted file candidate using the shared risky-file classifier. `AddTorrentModal` focused tests cover executable warnings, archive precedence, and magnet-only no-warning behavior.
- [x] Add remove/delete confirmation UX.
  - 2026-05-15 local status: Download Inspector opens a confirmation dialog that defaults to remove-from-app only and requires an explicit checkbox to move files to OS trash. The dialog passes typed `RemoveTorrentOptions` through the engine client and shows failure copy that no files were deleted.

## Phase 4 — Download Doctor

- [ ] Define health score algorithm v0.
- [ ] Add confidence level.
- [ ] Add port status placeholder.
- [ ] Add tracker status placeholder.
- [ ] Add DHT status placeholder.
- [ ] Add action recommendations.

## Phase 5 — libtorrent preparation

- [x] Create engine service boundary.
  - 2026-05-15 local status: Rust routes now use a `MockEngine` service for torrent state operations instead of mutating the in-memory torrent vector directly. A future `LibtorrentEngine` can replace this service boundary without changing the HTTP route contract.
- [x] Implement mock engine behind the boundary.
  - 2026-05-15 local status: `MockEngine` owns torrent records, duplicate info-hash lookup, status transitions, removals, and event snapshots.
- [x] Add mock engine event bus.
  - 2026-05-15 local status: Rust mock engine emits structured `torrent.added` and state-change events; `/v1/events` returns an event snapshot. Desktop `EngineClient` and `MockEngineClient` expose typed `listEvents()`.
- [x] Add duplicate info-hash handling.
  - 2026-05-15 local status: shared contract exposes optional `infoHash` and `DUPLICATE_TORRENT`; desktop mock client and Rust mock engine reject duplicate magnet `xt=urn:btih:` values case-insensitively. Real libtorrent metadata fetch remains pending.
- [ ] Add magnet metadata state machine.
  - 2026-05-14 branch status: implemented on `codex/magnet-metadata-state` (`c199ce8`), not merged to main.
- [x] Add `.torrent` metadata parser.
  - 2026-05-15 local status: Rust parser handles single-file and multi-file bencoded torrent metadata, SHA-1 info hash, private flag, total size, and unsafe path rejection. Real libtorrent import remains pending.
- [ ] Add ADR for chosen libtorrent binding/sidecar strategy.
- [x] Add build docs for native libtorrent dependencies.
  - 2026-05-15 local status: `apps/native-engine/README.md` documents Windows vcpkg setup, `LUMATORRENT_VCPKG_ROOT`, and MSVC developer command prompt build commands.
- [x] Implement first libtorrent spike in a separate branch.
  - 2026-05-14 branch status: native health smoke readiness exists on `codex/native-engine-health` (`0339216`); it was not CMake-verified at that time.
  - 2026-05-15 local status: native engine configures and builds in libtorrent mode with vcpkg, constructs an `lt::session`, starts with `libtorrent mode enabled`, and keeps the loopback bind guard. Real add-magnet/download lifecycle remains pending.

## Phase 6 — packaging and releases

- [ ] Add release dry-run artifacts.
- [ ] Add changelog process.
- [ ] Add installer QA checklist.
- [ ] Add signing/notarization documentation.
