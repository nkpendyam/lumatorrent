# Tauri Capabilities V12

## Required principle

Grant only what the frontend needs.

## Sidecar

Sidecar execution must be explicitly permitted. Keep the engine binary path fixed and controlled.

## Updater

Updater permissions must be explicitly configured when updater is added.

## Remote APIs

Never expose a remote engine API from Tauri by default.
