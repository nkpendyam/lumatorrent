# Phase 04 — QA, Release, and Operations

## Objective
Ship a desktop app that is stable across Windows, macOS, and Linux, with clear release criteria and repeatable QA.

## QA matrix
Test on:
- Windows 11
- latest macOS stable
- Ubuntu LTS

Critical scenarios:
- add magnet
- add .torrent
- metadata fetch
- pause/resume
- restart recovery
- app crash recovery
- delete without files
- delete with trash
- invalid filename
- disk full
- network drop
- engine restart
- expert mode settings change
- accessibility keyboard traversal

## Release gates
- CI green
- manual smoke tests complete
- native sidecar build verified
- release notes written
- update path verified
- known issues documented
