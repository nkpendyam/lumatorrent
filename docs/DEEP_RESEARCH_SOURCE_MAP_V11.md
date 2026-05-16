# Deep Research Source Map v11

## Codex and plan constraints

- OpenAI help: Codex usage depends on plan, task size, complexity, and execution environment.
- OpenAI Codex docs: use sandboxing and approvals rather than bypassing permissions.

## Tauri production architecture

- Tauri sidecars: external binaries can be bundled and executed with explicit permissions/capabilities.
- Tauri shell permissions: command APIs should be scoped.
- Tauri updater: production updates require signed/verifiable update flow.

## libtorrent implementation

- libtorrent session owns global torrent state and network loop.
- torrent_handle controls/query torrent state.
- alerts are the event mechanism.
- avoid blocking synchronous libtorrent calls on UI-sensitive paths.

## GitHub automation

- GitHub CLI supports `gh repo create`.
- GitHub CLI supports `gh issue create`.
- repo rulesets/branch protection may require GitHub API permissions and plan support.

## Design

- Apple HIG is the design reference for clarity, deference, depth, platform fit, typography, color, and symbol consistency.
- Google Stitch and similar tools are ideation accelerators, not production design sources.
