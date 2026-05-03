# Codex Start Here

## Goal
Autonomously build LumaTorrent like a strong senior engineer, using phased execution, model routing, tests, design specs, and safe automation.

## First commands
1. Read `AGENTS.md`.
2. Read `.codex/MODEL_ROUTING_POLICY.md`.
3. Read `docs/AUTONOMOUS_DEVELOPMENT_GUARDRAILS.md`.
4. Run the doctor/bootstrap scripts for the current OS.
5. Run `node scripts/verify-project.mjs`.
6. Produce a task plan for the next smallest shippable milestone.

## Development loop
- research
- plan
- implement
- test
- review
- document
- commit

## Mandatory phase sequence
Phase 00 → Phase 01 → Phase 02 → Phase 03 → Phase 04

## Premium design requirement
For every major UI milestone, create or refine:
- a design spec
- a component spec
- an accessibility checklist
- an image-generation prompt
- an implementation task list

## Important safety requirement
Do not try to bypass approvals or operating-system permissions. Use configured policies, scripts, and explicit approval settings only.

## v9 additions
Run:
```bash
pnpm verify:v9
pnpm contracts:validate
pnpm quality:score
pnpm codex:master
```
Then implement the next smallest task. Do not attempt the full torrent engine in one session.


## v10 first-run production commands
```bash
pnpm verify:v10
pnpm audit:v10
pnpm preflight:prod
pnpm github:doctor
```

Use GitHub automation only after reading `docs/GITHUB_AUTOMATION_RUNBOOK.md`.


## V12 execution note
Before asking Codex to implement features, run:
- `pnpm preflight:plus`
- `pnpm verify:v12`
- `pnpm gap:v12`
- `pnpm codex:context preflight`

Never ask Codex to build the full app in one task. Use milestone shards.
