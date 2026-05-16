# Next Codex Session Prompt

Read `.codex/START_HERE.md`, `.codex/CODEX_HIGH_EFFICIENCY_FEATURES.md`, and `docs/CODEX_TASKS.md` first.

Use the cheapest capable model for each subtask:

- Use `gpt-5.4-mini` for repo scanning, file discovery, repetitive edits, formatting, and simple fixes.
- Use `gpt-5.5` only for architecture, complex implementation, native engine integration, difficult debugging, and final review.
- Do not waste `gpt-5.5` on repetitive scanning.

Task:

1. Inspect the relevant files only.
2. State the smallest implementation plan.
3. Make the smallest safe change.
4. Add or update tests.
5. Run targeted verification.
6. Update docs if behavior changed.
7. Leave a short handoff note in this file for the next session.

## 2026-05-14 Handoff

Main checkout:

- Branch `main` is at `a73a11c chore: continue repo audit hardening`, ahead of `origin/main` by one commit.
- The main worktree still has pre-existing uncommitted Tauri/icon changes under `apps/desktop/src-tauri/`; do not overwrite or stage them unless the user explicitly asks.

Parallel worktree branches created from `a73a11c`:

- `codex/verify-format-sweep` at `f714a06 Format repo with Prettier`.
  - Reported full `pnpm verify` passing end to end.
  - Large formatting-only branch touching 196 files.
- `codex/native-engine-health` at `0339216 Add native engine health contract smoke`.
  - Adds native engine health smoke readiness.
  - `pnpm test:native:health-contract`, contract checks, and manual `g++` smoke passed.
  - Later local update: CMake/Ninja are now installed and native stub/libtorrent builds pass on Windows.
- `codex/safe-delete-to-trash` at `1cd4e2b feat(safety): add safe delete preview model`.
  - Adds pure shared safe-delete preview model, desktop trash adapter boundary, docs, and tests.
  - Shared/desktop tests, lint, typecheck, and touched-file formatting passed.
  - Real OS trash integration remains unimplemented/unverified.
- `codex/magnet-metadata-state` at `c199ce8 feat(engine): model magnet metadata states`.
  - Adds magnet metadata pending/resolved/timeout/error state contract and mock-engine transitions.
  - Shared/desktop targeted tests, lint, typecheck, and touched-file formatting passed.
  - Real libtorrent metadata fetching remains unimplemented.

Recommended next session order:

1. Decide whether to merge `codex/verify-format-sweep` first, because it reduces verification noise but is a large formatting diff.
2. Review/merge the smaller feature branches one at a time: safe-delete, magnet metadata, then native health.
3. Native CMake readiness is now locally verified on Windows; continue with real libtorrent add-magnet behavior.
4. After merges, run `PATH="/mnt/c/nvm4w/nodejs:$PATH" pnpm verify`.

## 2026-05-15 Handoff

Main checkout:

- Branch `main` is at `dbc8c15 docs: record parallel branch handoff`, ahead of `origin/main` by two commits.
- The worktree still has a large pre-existing dirty set, including broad formatting/docs/config changes and Tauri icon artifacts. Do not stage unrelated files blindly.
- The safe delete-to-trash engine boundary is locally integrated in the dirty worktree:
  - `apps/engine/src/safe_delete.rs`
  - `apps/engine/src/model.rs`
  - `apps/engine/src/routes.rs`
  - `apps/engine/src/state.rs`
  - `apps/desktop/src/api/engineClient.ts`
  - `apps/desktop/src/api/mockEngineClient.ts`
  - `packages/shared/src/types.ts`

Verification run on 2026-05-15:

- `cargo test -p lumatorrent-engine` passed: 11 tests.
- `pnpm --filter @lumatorrent/shared test` passed: 4 files, 17 tests.
- `pnpm --filter @lumatorrent/desktop test -- engineClient mockEngineClient` passed: 2 files, 12 tests.
- `pnpm --filter @lumatorrent/shared typecheck` passed.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.
- `pnpm contracts:validate` passed.

Recommended next step:

1. Run touched-file formatting or full `pnpm format:check` if preparing to commit.
2. Review the safe-delete/remove API diff and either commit that shard or fold it into the existing integration branch intentionally.
3. Continue to treat real OS trash QA as pending; only the local Rust plan and API boundary are verified.

## 2026-05-15 G4 Update

Completed one additional safety leaf:

- Add Torrent now shows a visible warning for the highest-risk selected or pasted file candidate.
- The warning uses the shared `classifyFileRisk` helper and distinguishes executable/script danger from archive/disk-image caution.
- Magnet-only input does not trigger a file warning.

Verification:

- `pnpm preflight:plus` passed.
- `pnpm verify:v12` passed.
- `pnpm gap:v12` still reports expected production gaps for real libtorrent, real metadata, real OS trash evidence, mock diagnostics, signing, and OS QA.
- `pnpm codex:context preflight` printed the preflight context pack.
- `pnpm --filter @lumatorrent/desktop test -- AddTorrentModal` passed: 1 file, 3 tests.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.
- `pnpm --filter @lumatorrent/shared test -- riskyFiles pathSafety` passed: 2 files, 10 tests.

Next small leaf:

1. Review the remaining unchecked M3 delete preview task against the locally integrated safe-delete engine boundary, or
2. Continue toward M4 with duplicate info-hash handling in the mock/native contract model.

## 2026-05-15 G2 Update

Completed another M3 safety leaf:

- `tests/fixtures/path-safety-cases.json` now drives shared TypeScript path-safety tests and Rust engine path-safety tests.
- Rust path validation now rejects repeated separators, drive-prefix paths, colon-containing segments, reserved Windows names, trailing dot/space segments, overlong paths, and leading/trailing whitespace instead of relying on platform path normalization.
- Shared path validation now rejects leading/trailing whitespace before normalizing separators.

Verification:

- `pnpm --filter @lumatorrent/shared test -- pathSafety riskyFiles` passed: 2 files, 13 tests.
- `cargo test -p lumatorrent-engine` passed: 13 tests.

## 2026-05-15 Remove UX Update

Completed an additional safety UX leaf:

- Download Inspector now opens a remove confirmation dialog.
- The dialog defaults to remove-from-app only.
- Moving downloaded files requires an explicit checkbox and sends `{ deleteFiles: true, useTrash: true }`.
- Failure copy says no files were deleted.

Verification:

- `pnpm --filter @lumatorrent/desktop test -- RemoveTorrentDialog AddTorrentModal` passed.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.

## 2026-05-15 Windows Trash Smoke Update

Completed a local OS trash QA shard:

- Added `safe_delete::tests::moves_owned_files_to_os_trash_smoke`, ignored by default because it moves a temporary file through the real OS trash/recycle-bin adapter.
- Added `pnpm test:engine:trash-smoke` to run that smoke intentionally.
- Ran the smoke on Windows 11 Home Single Language 10.0.26200, 64-bit.

Verification:

- `cargo test -p lumatorrent-engine` passed: 13 tests, 1 ignored trash smoke.
- `pnpm test:engine:trash-smoke` passed: 1 ignored smoke test executed.

Remaining safe-delete evidence:

- macOS Apple Silicon trash smoke.
- Ubuntu LTS trash smoke.
- Exact file preview from real torrent metadata before production delete UX is complete.

## 2026-05-15 Duplicate Info-Hash Update

Completed an M4 contract leaf:

- Shared `TorrentSummary` now has optional `infoHash`.
- Shared contract and engine error schema now include `DUPLICATE_TORRENT`.
- Desktop mock client extracts `xt=urn:btih:` and rejects duplicate hashes case-insensitively.
- Rust mock engine stores magnet info hashes and rejects duplicates case-insensitively before adding another row.

Verification:

- `pnpm --filter @lumatorrent/shared test -- engineContract` passed.
- `pnpm --filter @lumatorrent/shared typecheck` passed.
- `pnpm --filter @lumatorrent/desktop test -- mockEngineClient engineClient` passed: 2 files, 14 tests.
- `cargo test -p lumatorrent-engine` passed: 15 tests, 1 ignored trash smoke.
- `pnpm contracts:validate` passed.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.
- `pnpm --filter @lumatorrent/desktop lint` passed.

Remaining native blockers at that point:

- Later local update: CMake/Ninja are now installed and native stub/libtorrent builds pass on Windows.
- Real add-magnet/download lifecycle, metadata fetch, and post-metadata duplicate detection remain open.

## 2026-05-15 Engine Boundary And Events Update

Completed two engine-prep shards:

- Rust routes now call a `MockEngine` service for torrent state instead of directly owning the in-memory vector.
- `MockEngine` owns torrent records, duplicate info-hash checks, status transitions, removals, and event snapshots.
- Rust mock engine emits `torrent.added` and state-change events.
- `GET /v1/events` returns `{ events: EngineEvent[] }`.
- Desktop `EngineClient` and `MockEngineClient` expose typed `listEvents()`.
- Event reconciliation prepends new torrents from `torrent.added` events.

Verification:

- `cargo test -p lumatorrent-engine` passed: 17 tests, 1 ignored trash smoke.
- `pnpm --filter @lumatorrent/desktop test -- engineClient mockEngineClient` passed: 2 files, 15 tests.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.
- `pnpm contracts:validate` passed.

Next implementation shard at that point:

1. The Add Torrent UI file path/drag-drop wiring was later completed locally.
2. Native CMake readiness was later verified locally; start real libtorrent add-torrent behavior next.

## 2026-05-15 Event Cursor And Torrent Parser Update

Completed two more implementation shards:

- Rust mock engine event snapshots are capped and support `after` plus `limit`.
- Desktop `EngineClient.listEvents()` and `MockEngineClient.listEvents()` support the same cursor options.
- Added a Rust bencode `.torrent` metadata parser.
- Parser extracts name, files, total size, private flag, and SHA-1 info hash.
- Parser validates torrent-owned paths before they enter the engine manifest.
- `/v1/torrents/file` now accepts a local `.torrent` path, parses metadata, rejects duplicate info hashes, and inserts the torrent into the mock engine boundary.
- Desktop clients expose `addTorrentFile()`.

Verification:

- `cargo test -p lumatorrent-engine` passed: 21 tests, 1 ignored trash smoke.
- `pnpm --filter @lumatorrent/desktop test -- engineClient mockEngineClient` passed.
- `pnpm --filter @lumatorrent/desktop typecheck` passed.
- `pnpm --filter @lumatorrent/shared typecheck` passed.

Remaining parser/import work:

- Add a native OS file picker instead of only text path/drag-drop wiring.
- Add legal `.torrent` fixture file instead of inline parser fixtures.
- Connect real libtorrent add-torrent behavior.

## 2026-05-15 Native Toolchain And libtorrent Build Update

Completed the local Windows native dependency shard:

- Installed CMake `4.3.2` and Ninja `1.13.2` through winget.
- Confirmed Visual Studio Build Tools/MSVC are available through `VsDevCmd.bat`.
- Ran `scripts/setup-libtorrent.ps1`; `libtorrent:x64-windows@2.0.11` is installed in `C:\Users\nkpen\vcpkg`.
- Fixed native CMake presets to use `LUMATORRENT_WITH_LIBTORRENT`.
- Hardened `scripts/build-native-engine.ps1` so it prefers `LUMATORRENT_VCPKG_ROOT`, then the user vcpkg checkout, then `VCPKG_ROOT`, and fails on native command errors.
- Added Windows build instructions to `apps/native-engine/README.md`.

Verification:

- `scripts/build-native-engine.ps1 stub` passed from a Visual Studio developer command prompt.
- `scripts/build-native-engine.ps1 libtorrent` passed from a Visual Studio developer command prompt.
- `apps/native-engine` preset stub build passed.
- `apps/native-engine` preset libtorrent build passed with the vcpkg toolchain file.
- Libtorrent binary smoke passed: process prints `libtorrent mode enabled`.
- Unsafe bind smoke passed: `--host 0.0.0.0` exits `2` and refuses the bind.

Known remaining native work:

- CMake 4.3 emits a non-fatal vcpkg/Boost developer warning for CMP0167 during libtorrent configure.
- Real add-magnet, metadata fetching, progress alerts, resume data, and download lifecycle are still pending.
- macOS/Linux native libtorrent builds are still unverified.
