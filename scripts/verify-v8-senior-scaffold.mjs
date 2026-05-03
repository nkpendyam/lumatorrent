import { existsSync, readFileSync } from "node:fs";

const required = [
  "docs/PHASE_MASTER_PLAN.md",
  "docs/CODEX_AUTONOMOUS_TASK_TREE.md",
  "docs/DESIGN_BIBLE.md",
  "docs/UI_COMPONENT_SPEC_LIBRARY.md",
  "docs/IMPLEMENTATION_BACKLOG.md",
  "docs/REAL_ENGINE_MILESTONES.md",
  "docs/TEST_COVERAGE_MATRIX.md",
  "docs/FRONTEND_SCREEN_CONTRACTS.md",
  "docs/BACKEND_THEORY_OF_OPERATION.md",
  "docs/PERFORMANCE_BENCHMARK_PLAN.md",
  "docs/ACCESSIBILITY_AUTOMATION_PLAN.md",
  "docs/LOCAL_TORRENT_FIXTURE_LAB.md",
  "docs/V8_SENIOR_REPO_COMPARISON.md",
  "scripts/audit-v8-package.mjs",
  "scripts/test-engine-contracts.mjs",
  "scripts/performance-budget-check.mjs",
  "scripts/create-legal-fixtures.mjs"
];

let failed = false;
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`Missing required v8 file: ${file}`);
    failed = true;
  }
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (pkg.scripts?.["codex:models"] !== "node scripts/codex-model-router-help.mjs") {
  console.error("package.json script codex:models is not fixed.");
  failed = true;
}

if (failed) process.exit(1);
console.log("v8 senior scaffold OK");
