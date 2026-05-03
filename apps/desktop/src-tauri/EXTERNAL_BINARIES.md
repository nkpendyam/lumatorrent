# External Binaries

The production app will bundle the native engine sidecar as an external binary.

Expected development names:

- `lumatorrent-native-engine-x86_64-pc-windows-msvc.exe`
- `lumatorrent-native-engine-x86_64-apple-darwin`
- `lumatorrent-native-engine-aarch64-apple-darwin`
- `lumatorrent-native-engine-x86_64-unknown-linux-gnu`

Codex task:

1. Build native-engine in CI for each target.
2. Copy it into `apps/desktop/src-tauri/binaries/` with Tauri-compatible target suffixes.
3. Update `tauri.conf.json` externalBin after verifying local dev builds.

Do not commit large generated binaries unless the repository explicitly chooses that workflow. Prefer CI artifacts/releases.
