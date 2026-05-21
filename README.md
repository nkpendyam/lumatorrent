# LumaTorrent

LumaTorrent is an open-source desktop torrent client for legal file distribution. The goal is a calm, polished cross-platform app with strong file-safety defaults, a native libtorrent engine boundary, and diagnostics that explain what is happening instead of leaving users guessing.

## Status

LumaTorrent is in active development. The desktop shell, mock engine flows, contracts, path-safety rules, and native sidecar boundary exist. Real production torrent downloading is still being built behind the native engine boundary.

Current focus:

- complete native torrent lifecycle behavior
- harden engine contracts and event flow
- prove safe delete-to-trash behavior across operating systems
- replace mock diagnostics with real network and disk signals
- prepare repeatable desktop packaging

## Tech Stack

- Tauri 2 desktop shell
- React and TypeScript frontend
- Rust mock/local engine
- C++ native sidecar boundary for libtorrent
- pnpm workspace
- Vitest, Playwright, Cargo tests, and GitHub Actions

## Repository Layout

```text
apps/desktop       Tauri + React desktop app
apps/engine        Rust local/mock engine
apps/native-engine C++ native sidecar boundary
packages/shared    Shared contracts, types, and safety helpers
packages/ui        Shared UI primitives and design tokens
contracts/engine   Engine API and event schemas
docs               Product, architecture, safety, QA, and release docs
tests              Fixtures and cross-cutting test data
tools              Public project automation data
```

## Getting Started

Requirements:

- Node.js 20+
- pnpm 9+
- Rust toolchain
- platform build tools for Tauri/native engine work

Install and verify:

```bash
corepack enable
pnpm install
pnpm verify
```

Run the desktop app:

```bash
pnpm dev
```

Useful commands:

```bash
pnpm doctor
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm contracts:validate
pnpm test:rust
pnpm repo:hygiene
pnpm docs:hygiene
```

Native engine smoke commands:

```bash
pnpm test:engine:native-health
pnpm test:engine:native-add-magnet
pnpm test:engine:native-add-torrent-file
```

## Safety Principles

- No built-in piracy search.
- No automatic opening of downloaded files.
- Local APIs bind to localhost by default.
- Torrent-provided paths are always untrusted.
- Delete actions require explicit confirmation.
- File deletion must stay manifest-gated and use OS trash where supported.
- Diagnostics should be honest about confidence and uncertainty.

## Documentation

Start with:

- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/PHASE_MASTER_PLAN.md`
- `docs/ENGINE_IMPLEMENTATION_DAG.md`
- `docs/THREAT_MODEL.md`
- `docs/PRODUCTION_GAP_REGISTER.md`
- `docs/DOCS_INDEX.md`

## Contributing

Keep changes small, tested, and reviewable. For every meaningful change:

- update contracts when APIs change
- add or update tests
- document behavior changes
- run targeted checks first, then `pnpm verify`
- keep legal torrenting and file safety as product boundaries

## License

GPL-3.0-or-later.
