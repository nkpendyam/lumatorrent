import fs from 'node:fs';

const required = [
  'docs/V13_HARDENED_20_YEAR_ENGINEER_AUDIT.md',
  'docs/CODEX_90_DAY_EXECUTION_PLAN.md',
  'docs/ENGINE_IMPLEMENTATION_DAG.md',
  'docs/SENIOR_CODE_REVIEW_RUBRIC.md',
  'docs/CI_CD_HARDENING_MATRIX.md',
  'docs/REAL_WORLD_BETA_PLAN.md',
  'docs/PRODUCT_METRICS_AND_OBSERVABILITY_EVENTS.md',
  'docs/AI_ASSISTED_DESIGN_PIPELINE.md',
  'docs/OS_NATIVE_INTEGRATION_SPEC.md',
  'docs/SUPPLY_CHAIN_SECURITY_PLAN.md',
  'tools/production/v13-senior-scorecard.json',
  'tools/production/v13-implementation-dag.json',
  'apps/desktop/src-tauri/capabilities/default.json'
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error('v13 missing files:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}
console.log('v13 hardened scaffold OK');
