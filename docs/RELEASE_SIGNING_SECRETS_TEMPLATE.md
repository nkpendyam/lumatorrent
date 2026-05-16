# Release Signing Secrets Template

## Do not commit real values

This document lists required secret names only.

## GitHub secrets

- TAURI_PRIVATE_KEY
- TAURI_KEY_PASSWORD
- APPLE_ID
- APPLE_PASSWORD
- APPLE_TEAM_ID
- WINDOWS_CERTIFICATE_BASE64
- WINDOWS_CERTIFICATE_PASSWORD

## Local developer secret storage

Use OS keychain or GitHub Actions secrets. Never use plaintext committed files.
