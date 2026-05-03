# Codex Cloud Environment Checklist

Use this when running Codex in a cloud environment.

## Required setup command

```bash
bash .codex/setup.sh
```

## Required verification

```bash
pnpm run doctor
pnpm run verify
```

## Environment variables

Allowed non-secret variables:

- `LUMATORRENT_ENV=codex`
- `LUMATORRENT_ENGINE_MODE=stub`
- `RUST_BACKTRACE=1`

## Secrets

Secrets are allowed only for setup tasks and must not be printed.

Examples of secrets that must never be committed:

- Apple Developer credentials
- Windows signing certificates
- GitHub tokens
- Crash reporting DSNs
- VPN/private tracker credentials

## Native dependencies

If native libtorrent dependencies are unavailable in cloud:

1. Use stub engine mode.
2. Keep real engine work behind interfaces.
3. Open a follow-up task for local/native verification.

## Network policy

Use official registries and docs only.

Allowed examples:

- npm registry
- crates.io
- rustup
- official Tauri docs
- official Rust docs
- official libtorrent docs
- GitHub release downloads from trusted projects

Never pipe remote scripts directly into shell.
