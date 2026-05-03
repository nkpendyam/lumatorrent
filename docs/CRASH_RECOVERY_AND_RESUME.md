# Crash Recovery and Resume Data

## Requirements

- The UI must survive sidecar engine failure.
- The engine must save resume data atomically.
- Incomplete downloads must resume after app restart.
- Database state and engine state must be reconciled on startup.

## Atomic write pattern

1. Write to `file.tmp`.
2. fsync if platform allows.
3. Rename to final path.
4. Keep last known-good backup for critical state.

## Startup reconciliation

On startup:

1. Read app database.
2. Read engine resume data.
3. Check actual files on disk.
4. Mark missing/inconsistent torrents as `needs_attention`.
5. Never delete files automatically during reconciliation.

## Tests

- Kill engine while downloading.
- Kill desktop app while downloading.
- Corrupt resume file.
- Delete partial file manually.
- Move download folder manually.
