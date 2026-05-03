# OpenAI Codex Config Notes for V12

## Recommended pattern
Use repo-scoped `.codex/config.example.toml` and user-owned `~/.codex/config.toml`.

## Profiles
- scan: cheap model, read-only or workspace write only.
- implement: balanced model, workspace write.
- debug: stronger model, tests/builds allowed.
- review: strongest model, no large rewrites.

## Security
Use sandbox and approval policies. Do not bypass them.
