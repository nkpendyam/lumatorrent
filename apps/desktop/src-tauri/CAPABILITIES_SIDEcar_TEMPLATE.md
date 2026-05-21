# Sidecar Capability Template

When real sidecar spawning is implemented, create or update `src-tauri/capabilities/default.json` with the minimal shell permissions required by Tauri.

Do not grant broad shell access. Scope only the known engine sidecar binary.

Sidecar lifecycle permission rationale:

- `core:default` is the baseline Tauri window/runtime permission set.
- `shell:allow-spawn` is present only for the fixed `luma-engine` sidecar name with `"sidecar": true`.
- No arbitrary shell command, argument glob, current-directory, or remote execution permission should be added.
- The sidecar must continue to bind `127.0.0.1` only and require `X-Luma-Engine-Token`.
