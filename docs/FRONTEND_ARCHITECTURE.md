# Frontend Architecture

## Goals

- 60 FPS feeling on normal hardware.
- No rerender storms when speed updates arrive.
- Feature-oriented organization.
- Accessible components.
- Testable UI logic.

## Structure

```text
apps/desktop/src/
  app/              app shell
  api/              engine client and contracts
  components/       generic UI primitives
  features/         product features
  hooks/            reusable hooks
  lib/              formatting, guards, utilities
  state/            global client state where needed
  styles/           global tokens
```

## Data flow

- Engine state arrives through a client adapter.
- UI consumes normalized torrent summaries.
- High-frequency updates must be throttled or batched.
- Long lists should use virtualization before public beta.

## Animation rules

- Animate layout changes, not every speed tick.
- Use subtle spring transitions.
- Respect `prefers-reduced-motion`.
- Avoid expensive blur on large areas.

## Component rules

- Components must expose clear props.
- Feature components may know domain models.
- Primitive components must not know torrent logic.
