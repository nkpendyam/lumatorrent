# Safe Delete-to-Trash Implementation Spec

## Golden rules

- Never permanently delete by default.
- Never delete parent download directory blindly.
- Never follow symlinks when deleting torrent-owned files.
- Always show exact file list preview.

## Modes

1. Remove from app only.
2. Remove and move owned files to Trash/Recycle Bin.
3. Cancel.

## Required tests

- nested folders
- duplicate filenames
- unicode filenames
- dangerous paths
- symlinks
- shared folder
- missing files
- permission denied

## Current implementation status

The Rust mock engine now has a manifest-gated safe delete path:

- `POST /v1/torrents/:id/remove` defaults to remove-from-app-only.
- `deleteFiles: true` requires `useTrash: true`; permanent delete is rejected.
- Trash mode builds targets only from the engine-owned file manifest captured from selected torrent file paths.
- The planner rejects path traversal, duplicate resolved targets, symlink targets or symlink ancestors, directory entries, unsafe roots, and permission-denied checks.
- Missing files are reported and skipped instead of becoming deletion targets.
- File movement uses the cross-platform Rust `trash` crate so files go through the OS Trash/Recycle Bin path.
- `pnpm test:engine:trash-smoke` runs an intentionally ignored Rust smoke test that creates a temporary file, builds a manifest-gated delete plan, moves that file through the real OS trash adapter, and verifies that the original path is gone.

## OS QA evidence

| Date       | Platform                                           | Command                        | Result |
| ---------- | -------------------------------------------------- | ------------------------------ | ------ |
| 2026-05-15 | Windows 11 Home Single Language 10.0.26200, 64-bit | `pnpm test:engine:trash-smoke` | Pass   |

Known limitation: this is wired at the engine/client contract level, but the visible remove confirmation UI still needs an exact manifest preview from real torrent metadata before end-user file deletion is production-complete. OS-specific trash QA evidence is still required on macOS and Linux before closing the remaining safe-delete gap.
