# Engine Contract Strong Spec

## Design goals

The frontend must be able to run against a mock engine, a stub native engine, or a real libtorrent engine without changing UI code.

## Transport

Default: localhost HTTP or local IPC. Bind to `127.0.0.1` only. Require per-session auth token. Do not expose remote dashboard by default.

## Versioning

Every request must include or resolve against an engine API version.

## Core endpoints

- `GET /v1/health`
- `GET /v1/torrents`
- `POST /v1/torrents/magnet`
- `POST /v1/torrents/file`
- `POST /v1/torrents/:id/pause`
- `POST /v1/torrents/:id/resume`
- `POST /v1/torrents/:id/remove`
- `POST /v1/torrents/:id/recheck`
- `POST /v1/torrents/:id/diagnose`
- `GET /v1/events`

## Error taxonomy

- `INVALID_MAGNET`
- `TORRENT_PARSE_FAILED`
- `METADATA_TIMEOUT`
- `NO_SEEDERS_OBSERVED`
- `PORT_CLOSED`
- `TRACKER_TIMEOUT`
- `DHT_UNAVAILABLE`
- `DISK_FULL`
- `PERMISSION_DENIED`
- `PATH_REJECTED`
- `ENGINE_UNAVAILABLE`

## Event types

- `torrent.added`
- `torrent.metadata`
- `torrent.progress`
- `torrent.completed`
- `torrent.paused`
- `torrent.error`
- `engine.restarted`
- `diagnostic.updated`

## Real engine acceptance criteria

- frontend works unchanged against mock and real engine
- contract tests pass
- API never binds to public interface by default
- auth token required
- invalid paths rejected
- engine crash does not crash UI
