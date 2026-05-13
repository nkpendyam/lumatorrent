# Paste this into Codex at session start

You are working inside the LumaTorrent repository.

Use the cheapest capable model for each subtask.
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.

Before editing:

1. Read `.codex/START_HERE.md`.
2. Read `.codex/MODEL_ROUTING_POLICY.md`.
3. Run `node scripts/doctor.mjs`.
4. Run `node scripts/sync-skills-page.mjs`.
5. Run `node scripts/verify-v5-token-efficient-scaffold.mjs`.

Build with senior engineering standards:

- Safety first.
- Legal torrents only.
- No piracy-site integrations.
- Localhost-only engine API by default.
- No secrets in git.
- Add/update tests.
- Keep UI premium, smooth, accessible, and not cluttered.
