# Frontend Screen Contracts

## Dashboard contract
Inputs:
- torrents list
- global engine state
- filters/search/sort
- feature flags

Outputs:
- selected torrent ID
- user commands
- navigation events

Failure states:
- engine unavailable
- no downloads
- corrupted local state
- permission issue

## Add Torrent contract
Inputs:
- magnet string or torrent file
- default save path
- user file selection

Outputs:
- AddTorrentRequest
- cancel event
- validation result

Failure states:
- invalid magnet
- metadata timeout
- duplicate torrent
- insufficient disk space

## Inspector contract
Inputs:
- torrent detail
- file list
- tracker list
- peer list
- speed history

Outputs:
- lifecycle commands
- file priority commands
- diagnostic commands

## Settings contract
Inputs:
- settings snapshot
- platform capabilities
- feature flags

Outputs:
- validated settings update

Failure states:
- invalid path
- unsafe remote dashboard setting
- engine restart required
