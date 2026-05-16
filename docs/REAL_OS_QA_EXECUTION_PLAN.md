# Real OS QA Execution Plan

## Required machines

- Windows 11 x64.
- macOS Apple Silicon.
- Ubuntu LTS.

## Required tests

- install
- launch
- add legal torrent fixture
- pause/resume
- restart recovery
- delete safely
- settings persistence
- engine crash recovery
- updater dry run
- accessibility smoke

## Evidence to collect

- OS version
- app version
- logs
- screenshots for core flows
- failed test notes

## Collected evidence

| Date       | OS                                                 | Scope              | Command                        | Result |
| ---------- | -------------------------------------------------- | ------------------ | ------------------------------ | ------ |
| 2026-05-15 | Windows 11 Home Single Language 10.0.26200, 64-bit | Engine trash smoke | `pnpm test:engine:trash-smoke` | Pass   |

Remaining required coverage: full app-flow QA on Windows, macOS Apple Silicon, and Ubuntu LTS; safe delete-to-trash smoke on macOS and Ubuntu LTS.
