# Codex Model Routing Policy

This project is designed to conserve ChatGPT Plus / Codex usage and avoid wasting frontier-model tokens on repetitive work.

## Required routing prompt

Paste this at the top of every long Codex session for this repository:

```text
Use the cheapest capable model for each subtask.
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.
```

## Availability fallback

Model names can change by account, plan, workspace, and release channel. Before starting work, Codex must verify which models are available in the current environment. If `gpt-5.4-mini` is not available, use the cheapest/fastest available coding-capable model for scanning and simple edits. If `gpt-5.5` is not available, use the strongest available coding model for architecture, complex implementation, debugging, and final review.

## Task-to-model routing

| Subtask | Model class | Expected action |
|---|---|---|
| Repo tree scan | cheap/fast | Read filenames, detect modules, summarize structure only |
| File discovery | cheap/fast | Locate relevant files using grep/find/ripgrep |
| Simple rename/edit | cheap/fast | Apply small changes after exact file is known |
| Formatting/lint fix | cheap/fast | Fix mechanical style failures |
| Test triage | cheap/fast first | Summarize failing tests and logs |
| Architecture design | strongest | Define boundaries, APIs, safety model, and tradeoffs |
| libtorrent integration | strongest | Work on native engine, FFI/IPC, packaging decisions |
| Security review | strongest | Threat model, path traversal, remote API, update signing |
| Complex bug fix | strongest | Diagnose multi-file failures and race conditions |
| Final PR review | strongest | Review correctness, maintainability, tests, and safety |

## Token-saving workflow

1. Start with cheap/fast model to map the repo.
2. Produce a file-impact plan.
3. Switch to strongest model only when the plan involves architecture, native engine integration, security, or difficult debugging.
4. Switch back to cheap/fast model for repeated edits, formatting, and test reruns.
5. Never ask the strongest model to repeatedly list files, re-read unchanged files, or do bulk mechanical edits.
6. Use `docs/CODEX_TASKS.md` and `docs/PRODUCTION_BACKLOG.md` as the source of truth for task sequencing.

## Session command examples

If your Codex CLI supports model selection from the command line:

```bash
codex -m gpt-5.4-mini
codex -m gpt-5.5
```

Inside an active session, use the model switch command supported by your Codex environment, then continue the task.

## Required final review behavior

Every non-trivial PR must end with a strongest-model review pass using this checklist:

- Does the change preserve safety boundaries?
- Are path/file operations safe?
- Is the engine API still localhost-only by default?
- Are tests added or updated?
- Are docs updated if behavior changed?
- Did we avoid piracy-oriented features?
- Did we avoid unnecessary complexity?
