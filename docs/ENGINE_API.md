# Engine API Contract

The torrent engine is a local-only sidecar. The UI must communicate through a typed contract, not direct native calls.

## Transport for v0

- Bind address: `127.0.0.1` only.
- Auth: random session token passed by Tauri at engine launch.
- Format: JSON over HTTP for v0; gRPC or JSON-RPC can be considered later.
- Remote LAN access: disabled by default and out of scope for MVP.

## Core endpoints

### `GET /health`
Returns process health and engine version.

```json
{
  "ok": true,
  "engineVersion": "0.1.0",
  "torrentBackend": "mock|libtorrent",
  "uptimeSeconds": 42
}
```

### `POST /torrents/add-magnet`
Adds a magnet link.

Request:
```json
{
  "magnetUri": "magnet:?xt=urn:btih:...",
  "savePath": "/Users/me/Downloads",
  "selectedFiles": null
}
```

Response:
```json
{
  "torrentId": "tr_01H...",
  "status": "fetching_metadata"
}
```

### `GET /torrents`
Returns summaries for dashboard rendering. Must be cheap and throttled.

### `GET /torrents/{id}`
Returns detailed torrent state: files, trackers, peers, ratios, piece availability, and diagnostics input.

### `POST /torrents/{id}/pause`
Pauses a torrent.

### `POST /torrents/{id}/resume`
Resumes a torrent.

### `POST /torrents/{id}/remove`
Removes a torrent from app state. File deletion must be a separate explicit operation.

### `POST /diagnostics/{id}/run`
Runs Download Doctor checks and returns human-friendly causes plus machine-readable codes.

## Event stream

The engine should emit state changes through one stream instead of heavy polling.

```json
{ "type": "torrent.updated", "torrentId": "tr_123", "patch": { "progress": 0.72, "downloadSpeedBps": 8400000 } }
{ "type": "engine.warning", "code": "PORT_CLOSED", "message": "Incoming port appears closed." }
```

## Non-negotiable API rules

- Never trust frontend paths. Revalidate in the engine.
- Never delete files via generic paths. Delete only exact file manifest entries.
- Respect private torrent flags.
- Never expose the API on `0.0.0.0` in MVP.
- Every dangerous operation must be idempotent or require an operation token.
