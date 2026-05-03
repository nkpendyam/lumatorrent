#!/usr/bin/env node
import fs from 'node:fs';

const required = [
  '.codex/MODEL_ROUTING_POLICY.md',
  '.codex/UI_IMAGE_GENERATION_PLAYBOOK.md',
  '.codex/WEB_SKILLS_ACQUISITION_POLICY.md',
  '.codex/CODEX_COST_FAST_BUILD_PLAYBOOK.md',
  '.codex/templates/SESSION_START_PROMPT.md',
  '.codex/skills/skills-registry.json',
  'docs/SKILLS.md',
  'docs/AI/UI_IMAGE_GENERATION_WORKFLOW.md',
  'docs/CODEX_MODEL_AND_TOKEN_STRATEGY.md',
  'design/image-generation/PREMIUM_UI_PROMPTS.md',
  'scripts/sync-skills-page.mjs',
  'scripts/codex-model-router-help.mjs',
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('v5 verification failed. Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync('.codex/skills/skills-registry.json', 'utf8'));
if (!Array.isArray(registry.skills) || registry.skills.length < 10) {
  console.error('v5 verification failed: expected at least 10 skills');
  process.exit(1);
}

const routing = fs.readFileSync('.codex/MODEL_ROUTING_POLICY.md', 'utf8');
for (const phrase of ['Use the cheapest capable model', 'gpt-5.4-mini', 'gpt-5.5']) {
  if (!routing.includes(phrase)) {
    console.error(`v5 verification failed: missing routing phrase ${phrase}`);
    process.exit(1);
  }
}

console.log('v5 token-efficient senior scaffold OK');
