# Codex Autonomous Task Tree

## How to use this file
Codex should take one leaf task at a time. Do not grab a giant epic and rewrite the repo. For each task:
1. read relevant docs,
2. inspect files,
3. implement minimal change,
4. run targeted tests,
5. update docs if behavior changed,
6. request `/review` for meaningful diffs.

## EPIC A — Repository correctness
- A1 Fix broken package scripts.
- A2 Ensure all verification scripts run.
- A3 Add missing docs referenced by other docs.
- A4 Add CODEOWNERS and issue templates.
- A5 Make all scripts cross-platform or document platform limits.

## EPIC B — Design system
- B1 Implement design tokens in CSS.
- B2 Implement typed token exports.
- B3 Build Button, Card, Badge, Progress, Modal, Drawer, Tabs, Toast, CommandPalette.
- B4 Add component stories or demo page.
- B5 Add keyboard and reduced-motion tests.

## EPIC C — Premium dashboard
- C1 Empty dashboard.
- C2 Active downloads card layout.
- C3 Compact table view.
- C4 Search/filter/sort.
- C5 Batch actions.
- C6 Inspector drawer transition.

## EPIC D — Add torrent flow
- D1 Paste magnet validation.
- D2 Drag/drop `.torrent`.
- D3 Metadata loading state.
- D4 File selection state.
- D5 Save path selection.
- D6 Error states.

## EPIC E — Mock engine
- E1 Engine health endpoint.
- E2 Torrent list endpoint.
- E3 Add torrent endpoint.
- E4 Pause/resume/remove endpoints.
- E5 Event stream simulation.
- E6 Contract tests.

## EPIC F — Native engine
- F1 Stub sidecar executable.
- F2 Sidecar process launch from Tauri.
- F3 Auth token handshake.
- F4 Libtorrent build script.
- F5 First real magnet metadata fetch.
- F6 Real download to legal fixture folder.
- F7 Resume data handling.

## EPIC G — Safety
- G1 Safe path normalization.
- G2 Malicious filename tests.
- G3 Safe delete-to-trash implementation.
- G4 Risky file warnings.
- G5 Remote API bind-only-localhost test.
- G6 Secret scanning.

## EPIC H — Download Doctor
- H1 Health scoring baseline.
- H2 Tracker diagnostics.
- H3 DHT diagnostics.
- H4 Port check.
- H5 Queue diagnosis.
- H6 Disk diagnosis.
- H7 Confidence labels.

## EPIC I — QA and release
- I1 Playwright smoke tests.
- I2 Accessibility plan automation.
- I3 Performance budget script.
- I4 Package dry run.
- I5 Release checklist automation.
- I6 Platform compatibility matrix updates.

## EPIC J — Documentation
- J1 Keep README current.
- J2 Keep skills page current.
- J3 Add architecture decision records.
- J4 Add troubleshooting docs.
- J5 Add contributor quickstart.
