#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const required = [
  "docs/V11_HONEST_CODEX_SUBMISSION_AUDIT.md",
  "docs/CODEX_AUTONOMOUS_EXECUTION_MANUAL.md",
  "docs/MILESTONE_ACCEPTANCE_GATES.md",
  "docs/REQUIREMENTS_TRACEABILITY_MATRIX.md",
  "docs/PRODUCTION_DEFINITION_OF_DONE.md",
  "docs/CODEX_PROMPT_PACK_PER_MILESTONE.md",
  "docs/GITHUB_AUTOMATION_VALIDATION_PLAN.md",
  "docs/DEEP_RESEARCH_SOURCE_MAP_V11.md",
  "docs/ENGINE_THREADING_AND_ALERTS_PLAYBOOK.md",
  "docs/FINAL_MISSING_GAPS_AFTER_V11.md",
  "tools/codex/milestone-prompts.json",
  "tools/production/acceptance-gates.json",
  "tools/production/traceability.json",
  "scripts/preflight-local.mjs",
  "scripts/codex-mission-control.mjs",
  "scripts/github-plan.mjs",
  "scripts/production-readiness-gate.mjs",
];

let ok = true;
for (const rel of required) {
  if (!fs.existsSync(path.resolve(rel))) {
    console.error(`Missing required v11 artifact: ${rel}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log("v11 production execution scaffold OK");
