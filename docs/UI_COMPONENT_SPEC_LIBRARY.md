# UI Component Spec Library

## Button
### Variants
- primary
- secondary
- ghost
- destructive
- subtle
- icon

### States
- default
- hover
- active
- disabled
- loading
- focus-visible

### Rules
- destructive actions require confirmation if data/files may be removed.
- icon-only buttons must have accessible labels.

## DownloadCard
### Props
- name
- status
- progress
- downloadSpeed
- uploadSpeed
- eta
- health
- primaryAction
- secondaryActions

### States
- fetching metadata
- downloading
- paused
- completed
- seeding
- warning
- error

### Required UX
- progress must not jump jarringly
- speed should use smoothed display value
- health badge must include text

## ProgressBar
### Variants
- determinate
- indeterminate metadata
- verifying
- paused

### Rules
- do not animate on every byte update
- transition at readable cadence

## HealthBadge
### Values
- excellent
- good
- weak
- dead
- unknown

### Required copy
Always include text label.

## InspectorDrawer
### Tabs
- Overview
- Files
- Speed
- Trackers
- Peers
- Advanced

### Rules
- can be opened with keyboard
- can be closed with Escape
- preserves dashboard context

## AddTorrentModal
### States
- empty
- magnet detected
- parsing
- metadata loading
- file selection
- invalid
- ready

### Required safety
- never auto-add clipboard content without user approval

## DownloadDoctorPanel
### Sections
- Summary
- Likely causes
- Fixable issues
- Non-fixable constraints
- Recommended actions
- Technical details

### Rules
- distinguish certainty levels
- do not promise speed improvements

## CommandPalette
### Commands
- add torrent
- pause all
- resume all
- diagnose selected
- open settings
- reveal download folder
- toggle compact view

### Rules
- keyboard-first
- fuzzy search
- hidden commands respect feature flags

## ConfirmationDialog
### Used for
- remove torrent
- delete files
- reset settings
- enable remote dashboard

### Rules
- destructive option is never default
- show exact files affected when deleting
