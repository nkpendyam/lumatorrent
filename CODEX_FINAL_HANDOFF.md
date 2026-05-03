# LumaTorrent — Final Codex Production Handoff

## One-sentence mission

Build LumaTorrent as a premium, open-source, cross-platform torrent client for legal file distribution, with a calm Apple-inspired interface, a safe native engine boundary, and smart diagnostics that explain slow downloads better than existing clients.

## First truth

Do **not** ask Codex to "finish the whole app" in one run. This repo is designed for milestone execution. Codex should complete one small milestone, run gates, create a PR, and then move to the next milestone.

## Required first actions for Codex

Run these in order:

```bash
pnpm scripts:check
pnpm verify:v14
pnpm audit:v14
pnpm final:readiness
pnpm codex:final
pnpm gap:final
```

If `pnpm install` has not been run yet:

```bash
corepack enable
pnpm install
```

## Codex model routing

Use the cheapest capable model for each subtask.

- Use the cheaper/smaller model for repo scanning, file discovery, repetitive edits, formatting, and issue generation.
- Use the strongest available model only for architecture changes, libtorrent integration, debugging, security review, and final review.
- Do not waste the strongest model on repetitive scans.

If the exact model names in the user's account differ, Codex must inspect available model choices and select the closest matching cheap/strong pair.

## Autonomy boundaries

Codex may automate:
- repo scanning
- dependency install through official package managers
- tests/lint/builds
- GitHub CLI repo creation and issue/milestone creation after user authentication
- safe code generation
- docs updates
- local audits

Codex must not:
- bypass sandbox or OS permissions
- self-authorize account access
- store secrets in the repo
- run random downloaded scripts
- expose local engine APIs to the public network by default
- add piracy-site search integrations

## Execution sequence

1. M0: Local preflight and repo hygiene.
2. M1: Design tokens and UI shell.
3. M2: Dashboard and mock data polished.
4. M3: Settings persistence.
5. M4: Engine API contract and mock engine hardening.
6. M5: Safe file/path/delete implementation.
7. M6: Real libtorrent sidecar spike.
8. M7: Magnet and torrent import.
9. M8: Torrent lifecycle: add/pause/resume/remove.
10. M9: Download Doctor real diagnostics.
11. M10: Packaging, signing placeholders, QA matrix.
12. M11: Beta release and feedback loop.

## Definition of done for every milestone

- Requirements referenced.
- Tests added or updated.
- Accessibility considered.
- Error states handled.
- Security implications checked.
- Performance budget not violated.
- Docs updated.
- PR body includes verification commands and results.
