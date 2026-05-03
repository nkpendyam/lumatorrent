# Codex Review Prompt

Review the current diff as a senior systems/product engineer.

Focus on:

- correctness
- data loss risks
- path traversal and unsafe filenames
- localhost API exposure
- auth token handling
- torrent private-flag behavior
- performance regressions
- UI/UX quality
- accessibility
- test coverage
- documentation drift

Do not rewrite the code during review. Produce prioritized findings only.

Severity scale:

- Blocker: must fix before merge
- High: should fix before merge
- Medium: fix soon
- Low: polish or cleanup
