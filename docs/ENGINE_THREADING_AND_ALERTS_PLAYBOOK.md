# Engine Threading and Alerts Playbook

## Core rule
Do not call blocking libtorrent state queries from UI-sensitive paths.

## Architecture
- native engine owns libtorrent session
- alert pump consumes libtorrent alerts
- engine state cache stores UI-safe snapshots
- API requests return from the cache where possible
- event stream pushes diffs to frontend

## Alert categories
The engine should subscribe only to needed categories initially:
- error/status
- storage
- tracker
- peer
- DHT when diagnostics require it

## Snapshot loop
- aggregate status at controlled intervals
- throttle UI events
- preserve per-torrent detail for inspector only
- cap graph history

## Failure handling
- engine crash -> Tauri shell can restart sidecar
- corrupted resume data -> quarantine and recheck
- invalid torrent -> structured error
- disk full -> pause and warn
