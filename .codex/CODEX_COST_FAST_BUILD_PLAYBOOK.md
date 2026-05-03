# Cost-Efficient Fast Build Playbook

This project should be built quickly without wasting high-capability model usage.

## Operating rule

Use the cheapest capable model for each subtask.

Use the exact user-preferred prompt:

```text
Use the cheapest capable model for each subtask. 
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.
```

## Work batching

Codex must batch work into PR-sized units:

1. Discover with cheap/fast model.
2. Summarize files affected.
3. Implement one vertical slice.
4. Run tests.
5. Fix mechanical failures cheaply.
6. Use strongest model for final review only.

## Fast commands

Use these commands before asking a strong model to inspect the repo:

```bash
find . -maxdepth 3 -type f | sort
rg "TODO|FIXME|panic|unsafe|unwrap|localhost|delete|remove|path" .
pnpm -r test
cargo test --workspace
node scripts/verify-project.mjs
node scripts/verify-v5-token-efficient-scaffold.mjs
```

## Context discipline

Do not paste entire files into Codex unless needed. Prefer:

- file path
- exact function/component name
- relevant test failure
- relevant diff
- one concise goal

## Stop conditions

Stop and escalate to strongest model when:

- Native engine IPC changes
- Path safety changes
- Delete/remove behavior changes
- Remote API exposure changes
- Auto-update/signing changes
- Multi-platform packaging fails in non-obvious ways
