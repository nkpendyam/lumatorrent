# Crash Recovery Implementation Spec

## Goals

- Restart app after crash without losing torrent list.
- Restart engine sidecar without destroying UI session.
- Restore resume data safely.
- Detect mismatches between UI database and engine state.

## Required flows

- UI crash
- engine crash
- OS shutdown
- app force quit
- disk full during write
- corrupted resume data
