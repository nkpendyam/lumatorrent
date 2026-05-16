# AGENTS.md

## Mission

Build LumaTorrent as a premium, open-source, cross-platform torrent client for legal file distribution with Apple-style minimalism, strong safety defaults, and smart diagnostics.

## Operating principles

1. Use proven tech for risky systems work.
2. Use premium polish for the product experience.
3. Default to safety, accessibility, and testability.
4. Keep the product framed around legal torrenting.
5. Prefer explicit contracts over hidden coupling.
6. Prefer incremental delivery over giant rewrites.

## Required reading order for Codex

1. `.codex/START_HERE.md`
2. `.codex/MODEL_ROUTING_POLICY.md`
3. `.codex/CODEX_HIGH_EFFICIENCY_FEATURES.md`
4. `docs/PRODUCT_REQUIREMENTS.md`
5. `docs/ARCHITECTURE.md`
6. `docs/PHASE_00_DISCOVERY_AND_RESEARCH.md`
7. `docs/PHASE_01_DESIGN_SYSTEM_AND_UX.md`
8. `docs/DESIGN_RESEARCH_APPLE_2026.md`
9. `docs/PHASE_02_FRONTEND_IMPLEMENTATION.md`
10. `docs/PHASE_03_BACKEND_ENGINE_AND_IPC.md`
11. `docs/PHASE_04_QA_RELEASE_AND_OPERATIONS.md`
12. `docs/AUTONOMOUS_DEVELOPMENT_GUARDRAILS.md`

## UI/UX instructions

- Use image generation to create premium mock concepts for each major screen.
- Use Apple-inspired principles, not Apple copies.
- Use Stitch / 21st.dev only as ideation references.
- Convert inspiration into explicit engineering artifacts: tokens, components, screen specs, accessibility notes.

## Web research instructions

Codex may search the web for:

- official Apple design guidance
- official Tauri, Rust, libtorrent, React, Tailwind, Playwright, GitHub docs
- design inspiration sources and component references

Codex must summarize key findings into repo docs.
Codex must not blindly paste web content into code.

## Autonomy rules

Codex should automate as much as possible within approved policies.
Codex must not bypass permissions or self-authorize privileged actions.

## v8 mandatory additions

Before major implementation, Codex must read:

- `docs/PHASE_MASTER_PLAN.md`
- `docs/CODEX_AUTONOMOUS_TASK_TREE.md`
- `docs/DESIGN_BIBLE.md`
- `docs/UI_COMPONENT_SPEC_LIBRARY.md`
- `docs/IMPLEMENTATION_BACKLOG.md`
- `docs/REAL_ENGINE_MILESTONES.md`
- `docs/TEST_COVERAGE_MATRIX.md`

Codex must prefer one leaf task at a time and run targeted checks after each meaningful change.

## v9 world-class execution requirement

Before starting implementation work, Codex must read:

- `docs/WORLD_CLASS_PRODUCT_STRATEGY.md`
- `docs/SENIOR_ENGINEERING_EXECUTION_STANDARD.md`
- `docs/CODEX_EXECUTION_COMMAND_CENTER.md`
- `docs/ENGINE_CONTRACT_STRONG_SPEC.md`
- `docs/LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK.md`

Codex must keep every task small, tested, documented, and reviewable.

## v10 production execution additions

Before attempting broad implementation, Codex must read:

- `docs/V10_HONEST_CODEX_OUTCOME_AUDIT.md`
- `docs/CODEX_PLUS_PLAN_EXECUTION_STRATEGY.md`
- `docs/GITHUB_AUTOMATION_RUNBOOK.md`
- `docs/PRODUCTION_GAP_REGISTER.md`
- `docs/PRODUCTION_READINESS_SCORECARD.md`
- `docs/REAL_LIBTORRENT_IMPLEMENTATION_TASKS.md`

Codex may automate GitHub setup only through the scripts in `scripts/github-*` and only after GitHub CLI is authenticated by the user.

## v11 mandatory operating rule

Use `docs/MILESTONE_ACCEPTANCE_GATES.md` and `docs/PRODUCTION_DEFINITION_OF_DONE.md` before claiming any milestone is complete. Do not bypass permissions or self-authorize accounts.

## V12 execution note

Before asking Codex to implement features, run:

- `pnpm preflight:plus`
- `pnpm verify:v12`
- `pnpm gap:v12`
- `pnpm codex:context preflight`

Never ask Codex to build the full app in one task. Use milestone shards.

## V13 hardening instructions

Codex must treat `docs/V13_HARDENED_20_YEAR_ENGINEER_AUDIT.md`, `docs/CODEX_90_DAY_EXECUTION_PLAN.md`, and `docs/ENGINE_IMPLEMENTATION_DAG.md` as required planning context before touching native engine work. Use `pnpm dag:v13` to understand dependency order and `pnpm gap:v13` to report remaining critical gaps.
