# Architecture

## Core principle

Use proven technology for torrent networking and bleeding-edge polish for UX.

## High-level design

```text
React UI
  ↓ Tauri commands/events
Tauri shell / Rust controller
  ↓ localhost IPC or stdio
Torrent engine sidecar
  ↓ libtorrent
Network / disk / OS
```

## Why sidecar architecture

Directly binding a C++ torrent engine into the UI process increases crash risk and packaging complexity. A sidecar creates isolation:

- Engine crash does not necessarily crash UI.
- Engine can be restarted.
- Native dependency packaging is clearer.
- Protocol contracts can be tested independently.
- Future engine replacement is possible.

## Packages

```text
apps/desktop      Tauri + React app
apps/engine       Torrent engine sidecar boundary
packages/shared   Shared TypeScript/Rust-compatible contracts
packages/ui       Reusable UI primitives
```

## Runtime contracts

The UI never talks to libtorrent directly. It talks to an adapter:

```ts
TorrentEngineClient;
addMagnet(input);
pause(id);
resume(id);
remove(id, options);
getTorrents();
diagnose(id);
```

## UI update strategy

Torrent apps can become slow if every status update rerenders everything.

Rules:

- Aggregate status updates.
- Throttle UI updates to 250–500ms.
- Use virtualization for large lists.
- Do not store unbounded speed history.
- Details panels subscribe only to selected torrent.

## Data storage

SQLite is used for:

- App settings.
- Known torrents.
- UI state.
- Download history.
- Diagnostic history.

Engine resume data remains controlled by engine layer.

## Security boundaries

- All filesystem writes must validate target paths.
- All deletes must go through safe-delete service.
- Local API binds to `127.0.0.1` only.
- No remote dashboard in MVP.
- No built-in search.
