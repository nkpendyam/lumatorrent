# Backend Theory of Operation

## Overview

The app uses a Tauri shell, a frontend renderer, and a local engine boundary. The frontend never talks directly to libtorrent. It talks to an app-controlled engine API.

## Why this architecture

- isolates native crashes
- improves security review
- supports mock engine testing
- enables future remote-like control without exposing it by default
- keeps UI responsive

## Components

### Tauri host

Responsible for:

- windows
- tray/menu
- OS dialogs
- launching sidecar
- permission scopes
- update integration

### Engine sidecar

Responsible for:

- torrent session
- magnet and file loading
- lifecycle
- diagnostics
- event streaming
- persistence handoff

### Storage

Responsible for:

- settings
- UI preferences
- safe recent paths
- local app metadata

## Event model

The engine emits normalized events:

- TorrentAdded
- TorrentUpdated
- TorrentPaused
- TorrentCompleted
- TorrentErrored
- EngineWarning
- EngineHealthChanged

## Error philosophy

Errors must be typed, structured, and user-translatable.
