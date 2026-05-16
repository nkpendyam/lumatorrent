# Codex Plus Plan Execution Strategy

## Goal

Use the Plus plan efficiently without wasting context, model budget, or Codex task allowance.

## Model routing

Use the cheapest capable model for each subtask.
Use mini/fast models for:

- file discovery
- simple refactors
- formatting
- issue generation
- doc updates
- repeat edits

Use the strongest model only for:

- architecture changes
- libtorrent integration strategy
- hard debugging
- cross-platform packaging decisions
- final security/release review

## Session rules

1. Start every session with `docs/CODEX_EXECUTION_COMMAND_CENTER.md`.
2. Run `pnpm codex:next` to pick a focused task.
3. Do one task only.
4. Run tests before ending.
5. Ask Codex for a concise diff summary.
6. Use `/review` after meaningful changes.

## Context-saving rules

- Do not paste the whole repo into prompts.
- Point Codex to exact docs and files.
- Prefer scripts over repeated instructions.
- Keep task scope small.
- Update `docs/DECISIONS_LOG.md` when a major decision is made.

## Prompt template

```text
Read AGENTS.md, docs/CODEX_EXECUTION_COMMAND_CENTER.md, and the files relevant to this task only.
Task: <one specific task>
Constraints: keep changes minimal, add/update tests, update docs if behavior changes.
Use cheaper model for scanning and simple edits; use stronger model only if architecture/debugging is required.
Do not bypass permissions. Do not add piracy search. Do not expose network services publicly.
Run verification commands and report results.
```
