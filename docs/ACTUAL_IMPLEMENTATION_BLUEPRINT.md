# Actual Implementation Blueprint

## Architecture layers

1. Tauri shell.
2. React UI.
3. Engine client.
4. Local authenticated engine API.
5. Rust/C++ sidecar boundary.
6. libtorrent adapter.
7. persistence and resume data.
8. diagnostics services.

## Do not skip the mock-to-real ladder

- mock API must be contract complete.
- contract tests must pass.
- sidecar can be stubbed.
- libtorrent adapter must be hidden behind feature flag.
- real networking must be tested with legal fixtures only.

## Core data flow

Add torrent → validate input → create engine request → engine emits state events → UI reconciles event stream → persistence saves durable state → Download Doctor reads diagnostics snapshot.
