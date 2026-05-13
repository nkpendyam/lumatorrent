# Codex Execution Command Center

## Session model

Use one focused Codex session per milestone. Do not ask Codex to solve the entire app in a single giant context window.

## Mandatory opening prompt

```text
You are working in the LumaTorrent repo. Read AGENTS.md, .codex/START_HERE.md, docs/SENIOR_ENGINEERING_EXECUTION_STANDARD.md, and docs/CODEX_EXECUTION_COMMAND_CENTER.md first.
Use the cheapest capable model for each subtask.
Use mini models for scanning, file discovery, and simple edits.
Use the strongest model only for architecture, complex implementation, debugging, and final review.
Do not bypass permissions or run unknown scripts.
Pick the next smallest task from docs/CODEX_AUTONOMOUS_TASK_TREE.md.
Implement with tests and update docs.
```

## Phase command flow

1. `pnpm doctor`
2. `pnpm verify:structure`
3. `pnpm codex:master`
4. pick one task
5. implement
6. `pnpm test`
7. `pnpm contracts:validate`
8. `pnpm quality:score`
9. `/review`

## Model routing

- scan: cheapest capable model
- edit: cheapest capable model
- architecture: strongest model
- debugging: strongest model
- final review: strongest model

## Completion protocol

A task is not done until:

- code compiles in its package
- tests updated or added
- docs updated if behavior changed
- failure mode reviewed
- no secrets added
- no unsafe permissions added
