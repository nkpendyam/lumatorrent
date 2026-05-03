# Animation Guidelines

## Goal

Make the app feel smooth, calm, and premium without wasting CPU/GPU.

## Use animation for

- card entrance/exit,
- modal open/close,
- side panel expansion,
- progress changes using throttled updates,
- completed download acknowledgement.

## Avoid

- animated backgrounds,
- heavy blur across full-screen surfaces,
- bounce-heavy effects,
- animating every speed number update,
- motion that hides state changes.

## Reduced motion

All major animations must respect reduced-motion preferences.

## Performance budget

- Avoid rerendering every card on every engine tick.
- Batch status updates.
- Prefer transform/opacity animations.
