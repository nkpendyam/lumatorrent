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
  - `cmake` is still missing, so no CMake build was claimed.
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
3. Install or configure `cmake` before claiming native-engine build readiness.
4. After merges, run `PATH="/mnt/c/nvm4w/nodejs:$PATH" pnpm verify`.
