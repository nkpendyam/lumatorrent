# Threat Model

## Assets

- User files and download folders
- Local machine resources: CPU, memory, disk, network
- Torrent session state and history
- Remote dashboard token, if later implemented
- User trust and legal reputation

## Untrusted inputs

- `.torrent` files
- Magnet links
- Torrent metadata fetched from peers
- File names and folder paths inside torrent metadata
- Tracker responses
- Peer messages
- User-provided save paths
- Future remote dashboard requests

## High-risk threats and controls

### Path traversal

Controls: normalize paths, reject absolute paths and traversal segments, never follow symlinks when deleting, and keep path-safety tests mandatory in CI.

### Unsafe deletion

Controls: separate “remove from app” from “move files to trash,” delete only files listed in the torrent manifest, show exact deletion preview, prefer OS trash/recycle bin, and never delete parent folders blindly.

### Remote-control exposure

Controls: disabled by default, localhost binding in MVP, strong random auth token, no default passwords, and CSRF protection if browser-accessible.

### Malicious executables

Controls: classify risky file types, warn before opening executable/script/archive files, and never auto-open downloaded content.

### Resource exhaustion

Controls: virtualized file/peer lists, capped logs, capped speed history, metadata size limits, and disk-space preflight checks.

## Security release gate

A release cannot ship if any of these fail:

- Path-safety tests
- Delete-flow manual QA
- Engine API bind-address check
- Dependency audit review
- Private torrent behavior test
