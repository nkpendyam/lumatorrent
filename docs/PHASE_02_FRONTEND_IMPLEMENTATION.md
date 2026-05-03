# Phase 02 — Frontend Implementation

## Objective
Translate the design system into a production-quality desktop UI with excellent responsiveness, stable state handling, and safe feature-flagged rollouts.

## Frontend architecture rules
- Use feature folders.
- Prefer composition over giant page components.
- Keep domain logic outside presentational components.
- Use state containers intentionally.
- Keep visual states exhaustive and explicit.
- Use optimistic UI only when safe.

## Implementation order
1. design tokens and theme foundation
2. shell layout (sidebar / top bar / content area)
3. empty states
4. download card system
5. inspector drawer
6. add torrent flow
7. settings information architecture
8. diagnostics panels
9. command palette
10. graphs and performance instrumentation

## Required engineering quality
- visual regression review
- component tests
- keyboard interaction coverage
- reduced motion coverage
- loading / empty / error / success states for each screen
