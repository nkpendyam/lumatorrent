#!/usr/bin/env node
console.log(`
LumaTorrent Codex model routing

Use this policy at the start of every Codex session:

Use the cheapest capable model for each subtask.
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.

Suggested workflow:
1. cheap/fast model: scan repo and identify files
2. strongest model: design architecture or solve hard bug
3. cheap/fast model: mechanical edits and formatting
4. strongest model: final review

If those exact model IDs are unavailable, use the closest available cheap/fast model and strongest model.
`);
