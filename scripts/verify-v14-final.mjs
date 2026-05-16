import fs from "node:fs";

const required = [
  "CODEX_FINAL_HANDOFF.md",
  "docs/FINAL_OPINION_FOR_CODEX.md",
  "docs/FINAL_PRODUCTION_AUDIT_V14.md",
  "docs/FINAL_MILESTONE_SHARDS_FOR_CODEX_PLUS.md",
  "docs/FINAL_GAP_REGISTER_V14.md",
  "docs/FINAL_AUTONOMOUS_GITHUB_RUNBOOK.md",
  "docs/FINAL_DESIGN_AND_PRODUCT_BIBLE.md",
  "docs/FINAL_ENGINE_IMPLEMENTATION_PLAYBOOK.md",
  "docs/FINAL_TEST_AND_RELEASE_BIBLE.md",
  "tools/production/v14-final-gap-register.json",
  "tools/codex/final-context-packs-v14.json",
  "tools/production/v14-acceptance-gates.json",
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error("v14 missing files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log("v14 final production handoff OK");
