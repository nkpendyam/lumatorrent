# Contributing

Thanks for helping build LumaTorrent.

## Development setup

Run:

```bash
./scripts/doctor.sh
pnpm install
pnpm dev
```

## Before opening a PR

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
```

## Safety rules

Do not add:

- Built-in piracy search.
- Torrent website scraping.
- Silent file deletion.
- Remote API without authentication.
- Auto-open downloaded files.

## PR checklist

- Tests added or updated.
- UI states handled: loading, empty, error.
- Accessibility checked.
- Docs updated if needed.
