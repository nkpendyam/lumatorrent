# Production Engineering Playbook for Codex

You are working on LumaTorrent as a senior engineer. The project must never become a one-shot vibe-coded app.

## Non-negotiable rules

1. Keep the mock engine and native engine behind the same Engine API contract.
2. Never expose engine control APIs on `0.0.0.0` by default.
3. Never auto-delete downloaded files.
4. Never add built-in piracy search or torrent-index integrations.
5. Every native engine change must include tests or a QA note explaining why automation is not possible.
6. Every packaging change must run the doctor, unit tests, and release dry-run locally or in CI.
7. Add docs before adding risky features.

## Recommended implementation order

1. Make all current tests pass.
2. Run `node scripts/doctor-production.mjs`.
3. Build the mock engine and desktop UI.
4. Enable local IPC auth token enforcement.
5. Build native libtorrent sidecar in stub mode.
6. Install libtorrent per platform using `scripts/setup-libtorrent.*`.
7. Enable `LUMATORRENT_WITH_LIBTORRENT=1` and compile the native sidecar.
8. Implement only one feature at a time:
   - add magnet
   - list torrents
   - pause/resume
   - remove without deleting files
   - persist resume data
   - file list
   - tracker status
   - DHT status
9. Run the local torrent lab after each milestone.
10. Package unsigned dev builds first.
11. Add signing and notarization only after stable unsigned builds work.

## Definition of production-ready for v1

A v1 beta is not ready until:

- UI works with mock and native engine adapters.
- App resumes downloads after restart.
- Engine crash does not kill the desktop UI permanently.
- Remove/delete flows are safe and covered by tests.
- Windows, macOS, and Linux unsigned builds are generated in CI.
- Security model and privacy policy match actual app behavior.
- Local network test lab passes on at least one OS.
- Manual QA checklist is completed for all supported OSes.
