# Codex One-Run Reality Check

## Do not ask Codex to build everything in one run

A production torrent client is too large for a single reliable Codex run, especially on a Plus plan.

## Correct strategy

Use milestone shards:

1. Preflight and repo verification.
2. UI shell polish.
3. Settings persistence.
4. Engine contract hardening.
5. Mock add/pause/resume/remove flows.
6. Safe delete implementation.
7. Real .torrent import.
8. Real magnet metadata fetch.
9. libtorrent sidecar.
10. Download Doctor diagnostics.
11. packaging/release.

## Rule

Every Codex session should produce one focused PR-sized change with tests.
