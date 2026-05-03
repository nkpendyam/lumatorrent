# Definition of Done

A task is done only when all applicable items are true.

## Product

- User benefit is clear.
- Legal-use positioning is preserved.
- The feature has empty/loading/error/success states.
- Beginner and expert experiences are considered.

## Code

- TypeScript is strict and typed.
- Rust errors are typed, not stringly scattered.
- No new global mutable state without justification.
- Public interfaces are documented.
- No `any` unless isolated and justified.

## Testing

- Unit tests cover logic.
- Integration tests cover API boundaries when applicable.
- Safety tests cover dangerous paths/filesystem behavior.
- E2E smoke path still passes.

## Security

- Inputs are validated.
- Dangerous operations require confirmation.
- Local APIs remain localhost-bound.
- New network surfaces are documented in threat model.

## UX

- Copy is plain English first, technical details second.
- Keyboard and screen-reader behavior considered.
- Motion respects reduced-motion preference.
- Performance budget is not exceeded.

## Release

- Docs updated.
- Changelog entry added when user-visible.
- No secrets or certificates committed.
