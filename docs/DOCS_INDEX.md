# Documentation Index

This file maps the public product documentation. Local workspace notes are intentionally ignored and not part of the GitHub documentation surface.

## Primary Sources Of Truth

- Product and architecture: `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/PHASE_MASTER_PLAN.md`.
- Development sequence: `docs/PHASE_MASTER_PLAN.md`, `docs/IMPLEMENTATION_BACKLOG.md`, `docs/REAL_ENGINE_MILESTONES.md`.
- Acceptance and done rules: `docs/MILESTONE_ACCEPTANCE_GATES.md`, `docs/PRODUCTION_DEFINITION_OF_DONE.md`, `docs/TEST_COVERAGE_MATRIX.md`.
- Native engine: `docs/ENGINE_IMPLEMENTATION_DAG.md`, `docs/LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK.md`, `docs/REAL_LIBTORRENT_IMPLEMENTATION_TASKS.md`.
- Safety: `docs/THREAT_MODEL.md`, `docs/SECURITY_MODEL.md`, `docs/SAFE_DELETE_TO_TRASH_IMPLEMENTATION_SPEC.md`.
- Design: `docs/DESIGN_BIBLE.md`, `docs/UI_COMPONENT_SPEC_LIBRARY.md`, `design/design-tokens.json`.
- Release: `docs/RELEASE_CHECKLIST.md`, `docs/CODE_SIGNING_AND_NOTARIZATION.md`, `docs/PACKAGING_AND_DISTRIBUTION.md`.

## Cleanup Rules

- Run `pnpm repo:hygiene` before and after cleanup.
- Run `pnpm docs:hygiene` before proposing Markdown deletions.
- Do not delete source-of-truth docs, ADRs, research files, security docs, contracts, fixtures, lockfiles, CI, app icons, or active milestone documents.
- Delete or archive Markdown only after reference checks show it is superseded and unused.
- After any tracked cleanup, run `pnpm verify`.

## Current Status

- 2026-05-21: Conservative cleanup policy is active. The first pass added automated repo hygiene checks and this docs index. No tracked Markdown files were deleted in the first pass.
- 2026-05-21: `pnpm docs:hygiene` reports 186 tracked Markdown files and 25 conservative review candidates. These are not deletion-approved yet; each candidate still needs content review and a final `rg` reference check.
- 2026-05-21: Removed unreferenced superseded Markdown files after final `rg` checks.
- 2026-05-21: Local workspace and repository administration notes were moved to local-only Git ignore rules so GitHub presents a product repository.

## Initial Review Candidates

These files currently have no direct path or basename references outside `docs/DOCS_INDEX.md`. Review for archival or deletion in a separate cleanup shard:

- `docs/PRODUCT_ROADMAP_RELEASE_TRAINS.md`
- `docs/PERFORMANCE_BUDGET.md`
- `docs/DEEP_RESEARCH_SOURCE_MAP.md`
- `docs/OBSERVABILITY.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/QA_MANUAL_TEST_PLAN.md`
- `docs/UI_PRODUCTION_POLISH_BACKLOG.md`
- `docs/OBSERVABILITY_PRIVACY_STRONG_SPEC.md`
- `docs/COMPETITIVE_BENCHMARK_FRAMEWORK.md`
- `docs/LEGAL_AND_BRANDING.md`
- `docs/SECURITY_ABUSE_PREVENTION_STRONG_SPEC.md`
- `docs/ACCESSIBILITY_CHECKLIST.md`
- `docs/PRIVACY_POLICY_DRAFT.md`
- `docs/LOCAL_ENGINE_SECURITY_SPEC.md`
- `docs/TAURI_CAPABILITIES.md`
- `docs/BETA_TELEMETRY_AND_PRIVACY_OPT_IN.md`

## Pruned Superseded Files

- the old implementation plan was replaced by `docs/PHASE_MASTER_PLAN.md` and `docs/IMPLEMENTATION_BACKLOG.md`.
- the old first-task list was replaced by `docs/PHASE_MASTER_PLAN.md` and `docs/REAL_ENGINE_MILESTONES.md`.
- the old final context note was replaced by the public docs index.
- the old cleanup note was a stale meta note with no active execution role.
- the old lockfile policy was obsolete because `pnpm-lock.yaml` is already committed.
- old GitHub setup and labels notes were replaced by local-only repository administration files.
