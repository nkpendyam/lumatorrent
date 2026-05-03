# Packaging and Distribution Plan

## Supported packages

### Windows

- `.msi` or `.exe` installer through Tauri bundler
- Code-signed with a trusted certificate before public release
- SmartScreen reputation will still take time to build

### macOS

- `.dmg`
- Universal build preferred: Apple Silicon + Intel
- Apple Developer ID signing
- Notarization
- Stapling

### Linux

- AppImage for broad compatibility
- `.deb` for Debian/Ubuntu
- `.rpm` later
- Flatpak later after v1 beta

## CI strategy

- Every PR: lint, unit tests, Rust tests, frontend build, native-engine stub build.
- Main branch: release dry run.
- Tagged release: build unsigned artifacts first.
- Signed release only after secrets are configured.

## Do not skip

- Upgrade test from previous version
- Fresh install test
- App restart test
- Engine restart test
- Remove/delete safety test
- Download folder permission test
