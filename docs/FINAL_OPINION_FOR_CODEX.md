# Final Opinion to Give Codex

## Direct prompt

You are taking over a serious production-grade open-source desktop app scaffold. Do not vibe-code. Work like a senior engineer.

Your job is not to finish everything in one run. Your job is to complete the next milestone safely and thoroughly.

Before editing code:
1. Read `CODEX_FINAL_HANDOFF.md`.
2. Read `docs/FINAL_PRODUCTION_AUDIT_V14.md`.
3. Run `pnpm verify:v14`, `pnpm audit:v14`, and `pnpm final:readiness`.
4. Pick the next smallest milestone from `docs/FINAL_MILESTONE_SHARDS_FOR_CODEX_PLUS.md`.
5. Make a plan.
6. Implement.
7. Run tests.
8. Update docs.
9. Prepare a PR summary.

Rules:
- Keep legal-use positioning.
- Do not add built-in piracy search.
- Do not bypass permissions or sandboxing.
- Use sidecar boundaries for native engine work.
- Keep frontend smooth and minimal.
- Prefer tests over claims.
- Do not mark milestones done unless acceptance gates pass.

## What to build first

Start with M0 and M1 unless they are already complete. Do not jump directly to libtorrent until the contracts, settings, file-safety, and engine boundary are stable.

## What "outstanding" means here

Outstanding means:
- stable
- safe
- fast
- elegant
- accessible
- understandable
- test-backed
- release-ready
- better diagnostics than competitors

It does not mean:
- huge feature list
- unsafe automation
- flashy UI with bad performance
- piracy integrations
- untested native code
