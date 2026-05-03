console.log(`
LumaTorrent Codex Final Command Center

1. Preflight:
   pnpm scripts:check
   pnpm verify:v14
   pnpm audit:v14
   pnpm final:readiness

2. Start Codex:
   Give Codex CODEX_FINAL_HANDOFF.md + docs/FINAL_OPINION_FOR_CODEX.md

3. First prompt:
   Read CODEX_FINAL_HANDOFF.md.
   Run pnpm scripts:check, pnpm verify:v14, pnpm audit:v14.
   Fix only issues found by these checks.
   Do not start feature work yet.

4. Then execute milestones:
   M0 -> M1 -> M2 -> M3 -> M4 -> M5 -> M6...
`);
