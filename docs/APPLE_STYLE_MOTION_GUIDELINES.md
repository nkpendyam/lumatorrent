# Apple-Style Motion Guidelines

## Principles

- Motion communicates structure.
- Motion should not compete with content.
- Motion should feel smooth and responsive.
- Motion must degrade gracefully.

## Transition classes

### Micro interactions

Examples:

- button hover
- segmented control selection
- toggle change
  Recommended duration: 120–180ms

### Surface transitions

Examples:

- modal open/close
- inspector slide-in
- command palette
  Recommended duration: 180–260ms

### Structural transitions

Examples:

- route changes
- dashboard section changes
  Recommended duration: 220–320ms

## Implementation rules

- Prefer transform and opacity.
- Avoid animating height on large lists if possible.
- Never animate every telemetry tick.
- Batch updates on busy views.
- Respect Reduce Motion.
