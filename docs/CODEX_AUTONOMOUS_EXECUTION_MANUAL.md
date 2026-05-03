# Codex Autonomous Execution Manual

## Mission
Help Codex build LumaTorrent phase by phase with minimal token waste, strong guardrails, and production-grade acceptance criteria.

## Safe autonomy boundaries
Codex may automate:
- local project checks
- dependency installation through official package managers after approval
- GitHub repo creation after `gh auth status` passes
- GitHub labels, milestones, issues, and rulesets after explicit `--execute`
- tests, linting, contract validation, and CI simulation
- docs updates and issue generation

Codex must not:
- bypass OS permissions
- self-authorize GitHub/OpenAI accounts
- store secrets in the repo
- disable security controls
- expose remote dashboards publicly by default
- run arbitrary downloaded scripts

## Session pattern
Use one session per milestone.

### Prompt template
```
Read AGENTS.md, docs/CODEX_AUTONOMOUS_EXECUTION_MANUAL.md, and docs/MILESTONE_ACCEPTANCE_GATES.md.
Work only on milestone: <MILESTONE_ID>.
Use the cheapest capable model for scanning/simple edits and the stronger model only for architecture/debug/review.
Before editing, summarize the exact files you will touch.
After editing, run the relevant verification scripts and report failures honestly.
Do not start the next milestone.
```

## Context strategy
- Keep each Codex run under one milestone.
- Use scripts to print task context rather than pasting the whole repo.
- Keep architecture decisions in ADRs.
- Keep all API decisions in contracts.
- Keep all UI decisions in the design bible and screen contracts.

## Done means
A milestone is not done until:
- implementation exists
- tests exist
- docs are updated
- acceptance gate passes
- known gaps are recorded
