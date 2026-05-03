# Phase 03 — Backend, Engine, and IPC

## Objective
Build a stable service boundary between the desktop shell and the torrent engine.

## Architecture stance
The production architecture uses a local sidecar engine process instead of embedding complex torrent logic directly in the renderer.

## Required backend modules
- session manager
- torrent lifecycle manager
- diagnostics service
- health score service
- risk classifier
- safe path normalizer
- settings service
- event streaming service
- persistence layer

## IPC rules
- Bind locally only.
- Require auth token for engine requests.
- Define explicit request/response schemas.
- Version the API.
- Never expose remote control by default.
- Use structured errors.

## Libtorrent integration path
### Stage A
Mock engine with contract-complete API.
### Stage B
Stub native integration layer.
### Stage C
Real libtorrent integration behind a feature flag.
### Stage D
Performance tuning and crash recovery.
