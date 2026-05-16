# Production Definition of Done

A feature is production-ready only when all of these are true:

## Code

- implemented behind the correct abstraction
- typed contracts updated
- no duplicated domain logic
- no UI-thread blocking engine calls
- error states handled

## Tests

- unit tests added
- integration tests added when crossing process/API boundary
- e2e/manual test case added when user-visible
- regression test added for fixed bugs

## UX

- loading/empty/error/success states exist
- keyboard navigation works
- reduced motion considered
- plain-language error copy exists

## Security and safety

- input validation exists
- secrets are not logged
- dangerous actions require confirmation
- local APIs bind to localhost by default
- no permission bypass

## Docs

- relevant docs updated
- acceptance gate status updated
- known limitations recorded

## Release

- CI green
- QA scenario passed
- rollback path considered
