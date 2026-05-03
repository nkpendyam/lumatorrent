# Product Roadmap and Release Trains

## Release train A — Foundation Alpha
Goal: beautiful mock UI + stable scaffolding.
- design tokens
- dashboard
- add torrent modal mock
- inspector mock
- settings mock
- tests for formatting, safety, feature flags

## Release train B — Engine Contract Alpha
Goal: UI talks to local mock engine through real API boundaries.
- engine auth token
- contract schemas
- event stream model
- error taxonomy
- restart behavior simulation

## Release train C — Real Engine Preview
Goal: one legal torrent can download through libtorrent behind feature flag.
- session start
- add magnet
- add torrent file
- progress events
- pause/resume
- persist resume data

## Release train D — Safety Beta
Goal: safe real-world usage on test machines.
- delete-to-trash
- path traversal hardening
- risky file warnings
- disk full handling
- network drop recovery
- crash recovery

## Release train E — Public Beta
Goal: polished installers and community feedback.
- signed or clearly documented unsigned builds
- release notes
- QA matrix
- issue triage process
- telemetry off by default

## Release train F — v1
Goal: stable legal torrent client.
- real engine
- real diagnostics
- cross-platform packaging
- accessibility pass
- documented limitations
