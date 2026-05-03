# Milestone Shards for Codex on Plus

## Why this exists
A Plus plan can use Codex, but large tasks must be split to avoid wasting allowance and context.

## Shard size rules
- One shard = one PR.
- One shard should be reviewable in under 500 changed lines when possible.
- Large native integration work must be split into design, stub, adapter, tests, and platform hardening.

## Recommended order
M0: local preflight and repo creation.
M1: design token polish.
M2: dashboard and inspector UI.
M3: settings persistence.
M4: engine contract tests.
M5: mock torrent lifecycle.
M6: safe delete-to-trash.
M7: .torrent file parsing adapter.
M8: magnet metadata state machine.
M9: libtorrent sidecar skeleton.
M10: real add/pause/resume.
M11: Download Doctor diagnostics.
M12: release packaging dry run.
