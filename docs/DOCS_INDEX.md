# Documentation Index

This file is the cleanup map for the Markdown-heavy scaffold. It does not make every listed document permanent; it defines where contributors should look first and how to prune safely.

## Primary Sources Of Truth

- Product and architecture: `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/PHASE_MASTER_PLAN.md`.
- Execution queue: `docs/CODEX_TASKS.md`, `docs/CODEX_AUTONOMOUS_TASK_TREE.md`, `.codex/NEXT_SESSION_PROMPT.md`.
- Acceptance and done rules: `docs/MILESTONE_ACCEPTANCE_GATES.md`, `docs/PRODUCTION_DEFINITION_OF_DONE.md`, `docs/TEST_COVERAGE_MATRIX.md`.
- Native engine: `docs/ENGINE_IMPLEMENTATION_DAG.md`, `docs/LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK.md`, `docs/REAL_LIBTORRENT_IMPLEMENTATION_TASKS.md`.
- Safety: `docs/THREAT_MODEL.md`, `docs/SECURITY_MODEL.md`, `docs/SAFE_DELETE_TO_TRASH_IMPLEMENTATION_SPEC.md`.
- Design: `docs/DESIGN_BIBLE.md`, `docs/UI_COMPONENT_SPEC_LIBRARY.md`, `design/design-tokens.json`.
- Release and GitHub: `docs/RELEASE_CHECKLIST.md`, `docs/GITHUB_AUTOMATION_RUNBOOK.md`, `docs/CODE_SIGNING_AND_NOTARIZATION.md`.

## Cleanup Rules

- Run `pnpm repo:hygiene` before and after cleanup.
- Run `pnpm docs:hygiene` before proposing Markdown deletions.
- Do not delete source-of-truth docs, ADRs, research files, security docs, contracts, fixtures, lockfiles, CI, app icons, or active milestone documents.
- Delete or archive Markdown only after reference checks show it is superseded and unused.
- After any tracked cleanup, run `pnpm verify`.

## Current Status

- 2026-05-21: Conservative cleanup policy is active. The first pass added automated repo hygiene checks and this docs index. No tracked Markdown files were deleted in the first pass.
- 2026-05-21: `pnpm docs:hygiene` reports 186 tracked Markdown files and 25 conservative review candidates. These are not deletion-approved yet; each candidate still needs content review and a final `rg` reference check.

## Initial Review Candidates

These files currently have no direct path or basename references outside `docs/DOCS_INDEX.md`. Review for archival or deletion in a separate cleanup shard:

- `docs/IMPLEMENTATION_PLAN.md`
- `docs/PRODUCT_ROADMAP_RELEASE_TRAINS.md`
- `docs/FIRST_30_CODEX_TASKS.md`
- `docs/GITHUB_SETUP.md`
- `docs/PERFORMANCE_BUDGET.md`
- `docs/DEEP_RESEARCH_SOURCE_MAP.md`
- `docs/OBSERVABILITY.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/QA_MANUAL_TEST_PLAN.md`
- `docs/UI_PRODUCTION_POLISH_BACKLOG.md`
- `docs/OBSERVABILITY_PRIVACY_STRONG_SPEC.md`
- `docs/COMPETITIVE_BENCHMARK_FRAMEWORK.md`
- `docs/LEGAL_AND_BRANDING.md`
- `docs/FINAL_CONTEXT_FOR_CODEX.md`
- `docs/SECURITY_ABUSE_PREVENTION_STRONG_SPEC.md`
- `docs/FINAL_NO_MORE_SCAFFOLDING_ADVICE.md`
- `docs/ACCESSIBILITY_CHECKLIST.md`
- `docs/PRIVACY_POLICY_DRAFT.md`
- `docs/GITHUB_RULESETS_AND_SECRETS_STRICT_RUNBOOK.md`
- `docs/LOCKFILE_POLICY.md`
- `docs/OPENAI_CODEX_CONFIG_V12.md`
- `docs/LOCAL_ENGINE_SECURITY_SPEC.md`
- `docs/TAURI_CAPABILITIES_V12.md`
- `docs/BETA_TELEMETRY_AND_PRIVACY_OPT_IN.md`
- `docs/GITHUB_LABELS.md`
