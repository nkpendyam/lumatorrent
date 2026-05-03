# Performance Budget

The app must feel smooth on mid-range laptops, not just developer machines.

## UI budgets

- Dashboard interaction latency: under 100 ms.
- Torrent list update cadence: default 1 Hz, burst max 4 Hz.
- 100 active torrents: no visible UI freeze.
- 1,000 files in details panel: virtualized list required.
- Animations: use transform/opacity; avoid layout-heavy animations.
- Respect `prefers-reduced-motion`.

## Engine budgets

- Engine startup health response: under 2 seconds after process launch.
- Status summary endpoint: avoid large nested payloads.
- Peer/file detail endpoints: lazy load only when details panel is open.
- Speed history: ring buffer, not unbounded arrays.

## Memory budgets

- Do not store all peer samples forever.
- Cap logs.
- Keep file tree data compressed or lazy where possible.

## Performance tests to add

- Render 100 mock torrents.
- Render 5,000 file rows with virtualization.
- Run speed graph for 30 minutes without memory growth.
- Kill/restart engine while UI remains responsive.
