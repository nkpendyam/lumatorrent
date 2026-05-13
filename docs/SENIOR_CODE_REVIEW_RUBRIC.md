# Senior Code Review Rubric

## Every PR must answer

1. What user problem does this solve?
2. Which milestone/requirement does it map to?
3. What tests prove it works?
4. What can fail?
5. How is it observable?
6. Does it increase security, privacy, or safety risk?
7. Does it degrade performance or accessibility?

## Blockers

- unsafe file deletion
- remote API exposure by default
- secrets committed to repo
- unbounded polling loops
- generated code without review
- UI state without error/loading/empty states
- torrent behavior that violates private torrent flags

## Required review labels

- area/frontend
- area/engine
- area/security
- area/qa
- area/release
- risk/high when touching file deletion, engine networking, or signing
