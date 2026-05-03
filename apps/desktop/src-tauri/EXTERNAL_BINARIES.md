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

`tauri.conf.json` intentionally does not enable `externalBin` in M5 because no target-suffixed sidecar binary is produced yet. Enabling it early makes `cargo check` fail before the desktop shell can compile. Re-enable `externalBin` in the milestone that builds and stages the sidecar artifact.

`icons/icon.ico` is a generated placeholder only so Tauri workspace checks can compile on Windows during sidecar lifecycle work. Replace it with real product icons in the packaging/branding milestone.

M5 lifecycle scaffold:

- Frontend default remains mock mode.
- Local sidecar mode is opt-in through development configuration.
- The sidecar auth token is a per-launch secret and must not be printed in logs.
- Health checks use `GET /v1/health` with `X-Luma-Engine-Version: v1` and `X-Luma-Engine-Token`.
