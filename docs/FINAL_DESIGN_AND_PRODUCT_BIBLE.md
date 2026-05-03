# Final Design and Product Bible

## Design personality

- calm
- minimal
- precise
- premium
- fast
- readable
- trustworthy

## Apple-inspired rules

- Clarity: every state should be readable and obvious.
- Deference: chrome should support the download content, not dominate it.
- Depth: panels, overlays, and motion should explain hierarchy.

## Product promise

"The torrent client that explains what is happening."

## Main screens

1. First-run onboarding.
2. Dashboard.
3. Add torrent modal.
4. Metadata loading state.
5. Download detail inspector.
6. Files tab.
7. Speed tab.
8. Download Doctor.
9. Settings.
10. Safety warnings.
11. Completed downloads.
12. Error recovery.
13. Engine offline/restarting state.

## UX requirements

- Never show raw errors first.
- Explain every slow download in plain English where possible.
- Hide expert settings by default.
- Provide table mode for power users.
- Every destructive action must be explicit and reversible where possible.
- No animation should hurt performance.
- Reduced motion must be respected.
- Keyboard navigation must be first-class.

## Anti-patterns

- spreadsheet-first dashboard
- log-window diagnostics
- piracy-focused search
- auto-opening downloaded files
- unsafe delete defaults
- hidden background network services
- unbounded telemetry
