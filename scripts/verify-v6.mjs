import fs from 'node:fs';

const required = [
  '.codex/CODEX_HIGH_EFFICIENCY_FEATURES.md',
  '.codex/config.example.toml',
  '.codex/setup.sh',
  '.codex/REVIEW_PROMPT.md',
  '.codex/CONTEXT_BUDGET.md',
  '.codex/NEXT_SESSION_PROMPT.md',
  'docs/CODEX_FEATURES_AUDIT.md',
  'docs/CODEX_TOOLING_AND_MCP_POLICY.md',
  'docs/CODEX_CLOUD_ENVIRONMENT_CHECKLIST.md',
  'docs/FEATURE_FLAGS_AND_TOGGLES.md',
  'docs/PROMPTS/HIGH_EFFICIENCY_CODEX_PROMPTS.md',
  'apps/desktop/src/config/feature-flags.ts',
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('Missing v6 files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('v6 Codex high-efficiency scaffold OK');
