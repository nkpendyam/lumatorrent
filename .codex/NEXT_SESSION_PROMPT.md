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
