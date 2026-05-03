# Codex 90-Day Execution Plan

## Rule
Never ask Codex to build the whole product at once. Run one milestone per session, with tests and review.

## Month 1 — Product shell and safety foundations
### Week 1
- M0: run preflight, install dependencies, verify repo
- M1: finalize design tokens and app shell
- M2: dashboard polish and mock state
- M3: settings persistence

### Week 2
- M4: engine contract tests
- M5: safe path/file handling implementation
- M6: safe delete-to-trash abstraction
- M7: Add Torrent modal with validation

### Week 3
- M8: mock engine event stream
- M9: Download Doctor mock-to-contract integration
- M10: traceability updates and QA pass

### Week 4
- M11: GitHub automation dry run
- M12: CI hardening
- M13: beta-quality mock UI release

## Month 2 — Native engine integration
- NATIVE-001: sidecar spawn with Tauri capabilities
- NATIVE-002: local engine API with auth token
- NATIVE-003: libtorrent build probe
- NATIVE-004: async alert loop skeleton
- NATIVE-005: add .torrent file flow
- NATIVE-006: magnet metadata flow
- NATIVE-007: pause/resume/remove
- NATIVE-008: resume data and crash recovery

## Month 3 — Diagnostics, packaging, beta
- DIAG-001: port checker
- DIAG-002: tracker and DHT health
- DIAG-003: Download Doctor algorithm
- PKG-001: Windows build
- PKG-002: Linux AppImage/deb
- PKG-003: macOS build/notarization plan
- BETA-001: local beta QA
- BETA-002: bug triage and stabilization
