# UI World-Class Screen Blueprints

## Dashboard
Purpose: calm command center.
Must include:
- active downloads card stack
- compact table toggle
- global search
- health summary
- total speed
- smart mode status
- add torrent primary action
- command palette shortcut

## Add Torrent
Purpose: zero-confusion import.
States:
- empty
- magnet detected
- validating
- fetching metadata
- file selection
- path selection
- safety warnings
- ready
- failed

## Inspector
Purpose: powerful details without clutter.
Tabs:
- overview
- files
- speed
- trackers
- peers
- advanced

## Download Doctor
Purpose: explain slow downloads.
Structure:
- plain-language summary
- fixable causes
- external limitations
- one-click safe actions
- technical details disclosure

## Settings
Purpose: simple defaults with expert escape hatch.
Sections:
- General
- Downloads
- Speed
- Network
- Privacy & Safety
- Appearance
- Advanced

## Empty states
Every empty state must answer:
- what happened?
- what can I do next?
- is anything wrong?

## Danger flows
Delete/remove and risky-file warnings must be explicit and reversible where possible.
