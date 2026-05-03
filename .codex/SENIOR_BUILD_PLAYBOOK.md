# Senior Build Playbook

## Mission

Build LumaTorrent like a mature systems product:

- stable under poor networks,
- safe with untrusted torrent metadata,
- beautiful and fast at 60 FPS,
- understandable to beginners,
- powerful for experts,
- legally positioned for legitimate torrents.

## Engineering style

Prefer boring reliability in the core and premium innovation in the UX.

Good bleeding edge:

- smooth UI transitions,
- Download Doctor diagnostics,
- health score confidence,
- safe delete preview,
- adaptive speed recommendations,
- local-first privacy.

Bad bleeding edge for early versions:

- custom torrent protocol,
- built-in pirate search,
- anonymous routing,
- cloud accounts,
- plugin marketplace,
- AI features without deterministic fallback.

## Implementation loop

For every task:

1. Define the user-visible outcome.
2. Define failure modes.
3. Write or update tests.
4. Implement behind small interfaces.
5. Check performance and accessibility impact.
6. Update docs.

## Quality bar

- UI must have loading, empty, error, and success states.
- Backend errors must be typed and actionable.
- Dangerous filesystem operations need explicit confirmation.
- Engine restarts must not corrupt UI state.
- Any feature using network/filesystem must have a security note.
