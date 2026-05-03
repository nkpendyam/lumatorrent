# Code Signing and Notarization

This repository cannot include real signing certificates, private keys, Apple credentials, or Windows signing credentials.

A senior project includes the wiring, docs, and secret names, but the owner must provide the actual credentials.

## GitHub Actions secrets

Recommended secrets:

### Shared

- `TAURI_PRIVATE_KEY`
- `TAURI_KEY_PASSWORD`

### macOS

- `APPLE_ID`
- `APPLE_PASSWORD`
- `APPLE_TEAM_ID`
- `APPLE_CERTIFICATE`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_SIGNING_IDENTITY`

### Windows

- `WINDOWS_SIGNING_CERTIFICATE`
- `WINDOWS_SIGNING_CERTIFICATE_PASSWORD`
- `WINDOWS_SIGNING_TIMESTAMP_URL`

## Local developer rule

Unsigned local dev builds are allowed. Public releases must be signed.

## Codex rule

Codex must never invent or commit private keys, certificates, passwords, or fake secrets. It may update workflows and docs only.
