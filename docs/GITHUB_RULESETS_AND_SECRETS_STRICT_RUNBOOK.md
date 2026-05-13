# GitHub Rulesets and Secrets Strict Runbook

## Ruleset goals

- Protect main branch.
- Require PR review.
- Require CI.
- Block direct pushes where supported.
- Require signed release workflow secrets only in CI environment.

## Required secrets placeholders

- TAURI_PRIVATE_KEY
- TAURI_KEY_PASSWORD
- APPLE_ID
- APPLE_PASSWORD
- APPLE_TEAM_ID
- WINDOWS_CERTIFICATE_BASE64
- WINDOWS_CERTIFICATE_PASSWORD

Never commit real secrets.
