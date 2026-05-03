# Manual QA Test Plan

Use only legal torrents and local test fixtures.

## Core flow

1. Launch app fresh.
2. Add legal magnet link.
3. Confirm metadata loading state.
4. Select files and save path.
5. Start download.
6. Pause and resume.
7. Quit app during download.
8. Reopen app and confirm resume state.
9. Complete download.
10. Reveal files.

## Slow download states

- No seeders.
- Metadata not found.
- Tracker timeout.
- DHT disabled.
- Port closed.
- Disk full.
- VPN/proxy configured incorrectly.

## Dangerous file states

- Executable file warning.
- Archive warning.
- Unknown extension warning.
- Unicode filename display.
- Long filename rejection.

## Delete flow

- Remove from app only.
- Move files to trash.
- Confirm deletion preview exact file list.
- Shared parent folder is not deleted.
