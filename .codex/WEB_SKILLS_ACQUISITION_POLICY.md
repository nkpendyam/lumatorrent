# Web Skills Acquisition Policy for Codex

The user wants Codex to autonomously learn the skills needed to build this project. This must be done safely.

## Goal

Codex may use the web to gather official documentation, install normal package dependencies, and create/update a project skills page. Codex must not blindly download and execute arbitrary scripts.

## Allowed sources

Prefer official, primary sources:

- Tauri documentation
- React documentation
- TypeScript documentation
- Rust documentation
- Cargo documentation
- libtorrent documentation
- CMake documentation
- GitHub Actions documentation
- Playwright documentation
- Tailwind CSS documentation
- shadcn/ui documentation
- Motion documentation
- OpenAI Codex documentation
- OpenAI image generation documentation

## Skills page

Codex must maintain:

- `docs/SKILLS.md`
- `.codex/skills/skills-registry.json`

Each skill entry must include:

- Name
- Purpose in this project
- Official documentation URL
- Install command if any
- Verification command
- Security notes
- Status: `planned`, `installed`, `verified`, or `blocked`

## Safety rules

1. Do not install random GitHub repos as global tools without reviewing the repository and license.
2. Do not pipe remote scripts into shell, e.g. `curl ... | sh`.
3. Prefer package managers with lockfiles: `pnpm`, `cargo`, OS package manager.
4. Never commit secrets, tokens, signing keys, certificates, or `.env` files.
5. Record every new tool or dependency in `docs/SKILLS.md` and `docs/DEPENDENCY_POLICY.md`.
6. Run `pnpm audit` or equivalent where possible.
7. Run `cargo audit` if available.
8. If a tool needs admin/root privileges, explain why and ask for approval.
9. If a skill cannot be installed safely, mark it as `blocked` with the reason.

## Autonomous setup workflow

1. Run `node scripts/doctor.mjs`.
2. Run `node scripts/doctor-production.mjs`.
3. Run `node scripts/sync-skills-page.mjs`.
4. Read `docs/SKILLS.md`.
5. Install missing project dependencies using approved package managers.
6. Re-run doctor scripts.
7. Update skill statuses.
8. Run verification and tests.

## Human approval required

Codex must ask before:

- Installing system packages with admin/root rights
- Enabling remote dashboard exposure
- Adding new external services
- Changing license terms
- Adding telemetry/crash reporting
- Uploading artifacts anywhere
- Running unreviewed downloaded binaries
