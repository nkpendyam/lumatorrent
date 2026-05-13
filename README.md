# LumaTorrent Senior Codex Starter v3

LumaTorrent is a professional open-source desktop torrent client concept focused on **legal torrents**, premium UI/UX, and smart diagnostics.

This repository is intentionally a **senior-grade project foundation**, not a finished torrent downloader. It is designed so Codex or a developer can build the product safely in phases without vibe-coding fragile networking software.

## Product promise

> A beautiful open-source torrent client that explains what is happening, protects user files, and gives power users control without overwhelming beginners.

## What is included

- Tauri 2 desktop shell scaffold
- React + TypeScript UI scaffold
- Rust sidecar engine scaffold
- Localhost API contract and mock implementation
- Download Doctor concept and diagnostics model
- Professional UI/UX design system
- Security model, threat model, path safety rules
- Accessibility, performance, and QA checklists
- GitHub Actions CI, security workflows, issue templates, PR template
- Codex operating instructions and task queue
- Bootstrap/doctor scripts for Windows/macOS/Linux
- Release engineering documents

## What is intentionally not included yet

- Production libtorrent binding
- Signed production installers
- Real update server
- Real app icon set
- Native code signing certificates
- Finished torrent downloader behavior

This is deliberate. A senior implementation must isolate the torrent engine behind a sidecar/API boundary first, then replace the mock engine with libtorrent behind tests.

## First commands

```bash
# 1. Check installed tools only
pnpm doctor

# 2. Optional: install/check dependencies
./scripts/bootstrap.sh --install --yes
# or Windows:
./scripts/bootstrap.ps1 -Install -Yes

# 3. Install JS dependencies
pnpm install

# 4. Run quality checks
pnpm verify

# 5. Start desktop app
pnpm dev
```

## Codex start point

Open these files first:

1. `.codex/START_HERE.md`
2. `.codex/SENIOR_BUILD_PLAYBOOK.md`
3. `docs/CODEX_TASKS.md`
4. `docs/DEFINITION_OF_DONE.md`
5. `docs/ENGINE_API.md`
6. `docs/UX_SCREEN_SPECS.md`

## Architecture summary

```text
React premium UI
  ↓ Tauri commands/events
Tauri Rust shell
  ↓ local authenticated IPC/HTTP
Torrent engine sidecar
  ↓ libtorrent adapter later
BitTorrent network / disk
```

## Safety rules

- No built-in piracy search.
- No auto-opening downloaded files.
- No permanent delete by default.
- Remote dashboard disabled by default.
- Local API binds to `127.0.0.1` only.
- Every file path from a torrent is untrusted.
- Dangerous actions need previews and confirmations.

## License

GPL-3.0-or-later.

## v4 production engineering additions

This package includes the production layers needed for a serious torrent client build:

- Native libtorrent sidecar scaffold with CMake and feature-gated source code
- OS dependency installers/checkers for Windows, macOS, and Linux
- Packaging and release workflows for Tauri desktop builds
- Code-signing and notarization documentation with required secret names
- Local network torrent test lab design for legal/offline QA
- Release, rollback, crash recovery, and platform QA playbooks
- Codex milestone plan for replacing mock engine with the native sidecar

Private signing certificates, Apple Developer credentials, Windows signing keys, and production binaries are intentionally not included. They must be generated or provided by the project owner and stored as GitHub Actions secrets or local keychain/cert-store entries.

## v5: Token-efficient Codex build mode

This repository includes a Codex operating layer for fast, cost-conscious development:

```text
Use the cheapest capable model for each subtask.
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.
```

Start with:

```bash
node scripts/sync-skills-page.mjs
node scripts/codex-model-router-help.mjs
pnpm verify:v5
```

Read:

- `.codex/MODEL_ROUTING_POLICY.md`
- `.codex/CODEX_COST_FAST_BUILD_PLAYBOOK.md`
- `.codex/WEB_SKILLS_ACQUISITION_POLICY.md`
- `.codex/UI_IMAGE_GENERATION_PLAYBOOK.md`
- `docs/SKILLS.md`
- `design/image-generation/PREMIUM_UI_PROMPTS.md`

## v7 additions

- Detailed phase-by-phase development docs
- Apple-style design research pack
- Safe autonomous Codex guardrails
- Cross-platform design adaptation guidance

## v8 additions

v8 adds the missing senior-execution layer:

- Phase master plan
- Codex autonomous task tree
- Design bible
- UI component spec library
- Implementation backlog
- Real engine milestones
- Test coverage matrix
- Backend theory of operation
- Performance benchmark plan
- Accessibility automation plan
- Local legal fixture lab
- v8 audit and verification scripts

## v9 world-class execution scaffold

v9 adds stronger production execution docs, real contract scaffolding, more frontend screens, stronger native-engine scaffolding, contract validation scripts, and an honest world-class audit.

Run:

```bash
pnpm verify:v9
pnpm audit:v9
pnpm contracts:validate
pnpm quality:score
```

## v10 production execution additions

This version adds safer GitHub automation, a Plus-plan Codex execution strategy, a production gap register, readiness scorecard, real libtorrent implementation tasks, and stronger v10 verification scripts.

Start with:

```bash
pnpm verify:v10
pnpm audit:v10
pnpm preflight:prod
pnpm github:doctor
```

## v11 additions

- Honest Codex submission audit
- Milestone acceptance gates
- Requirements traceability matrix
- Production Definition of Done
- Codex autonomous execution manual
- GitHub automation validation plan
- Local preflight and safe bootstrap scripts

## v12 additions

- Codex context packs.
- Plus-plan milestone sharding.
- Real implementation specs for torrent flows.
- Safe delete-to-trash spec.
- Download Doctor algorithm spec.
- GitHub project board planning.
- OS QA matrix.
- Production gap reporting.
