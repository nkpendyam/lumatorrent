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
