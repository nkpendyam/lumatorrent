# ADR-0001: Use Tauri + React + Rust sidecar architecture

## Status

Accepted for v0.x.

## Context

The app needs premium desktop UX, strong local security boundaries, and a future path to native torrent performance without coupling the UI process directly to native torrent crashes.

## Decision

Use Tauri for the desktop shell, React/TypeScript for the UI, and a separate Rust torrent-engine sidecar process. The sidecar initially exposes a mock contract and later wraps libtorrent behind a stable local API.

## Consequences

- UI can ship and be tested before native libtorrent integration is complete.
- Engine crashes can be isolated and recovered.
- IPC/API contracts must be treated as product-level interfaces.
- Packaging must include sidecar binaries for every platform.
