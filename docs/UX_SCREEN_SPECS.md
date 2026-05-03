# UX Screen Specs

## 1. Empty Dashboard

Goal: make first use obvious within 10 seconds.

Primary copy:

> No downloads yet. Paste a magnet link or drop a `.torrent` file to begin.

Primary actions:

- Add Torrent
- Open legal examples docs

States:

- no downloads,
- no active downloads,
- offline/network warning.

## 2. Active Dashboard

Shows cards by default:

- name,
- status,
- progress,
- download/upload speed,
- ETA,
- health badge,
- quick actions.

Power users can switch to table view later.

## 3. Add Torrent Modal

Flow:

1. paste magnet or drop file,
2. validate input,
3. fetch metadata,
4. show file list,
5. choose destination,
6. start.

Never auto-add clipboard content without permission.

## 4. Details Side Panel

Tabs:

- Overview,
- Files,
- Speed,
- Trackers,
- Peers,
- Advanced.

Keep the dashboard visible behind it.

## 5. Download Doctor

Must answer:

- What is wrong?
- Is it fixable?
- What should I do next?
- How confident is the diagnosis?

Use plain-language diagnosis with optional technical details.

## 6. Remove/Delete Dialog

Buttons:

- Remove from app only,
- Move downloaded files to Trash,
- Cancel.

Default must be cancel or remove-only, never delete.

## 7. Risky File Warning

Warn when a torrent contains executable/script/installer files.

Copy:

> This download contains executable files. Only open them if you trust the source.
