#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
const required=[
  'docs/V10_HONEST_CODEX_OUTCOME_AUDIT.md',
  'docs/CODEX_PLUS_PLAN_EXECUTION_STRATEGY.md',
  'docs/GITHUB_AUTOMATION_RUNBOOK.md',
  'docs/PRODUCTION_GAP_REGISTER.md',
  'docs/PRODUCTION_READINESS_SCORECARD.md',
  'docs/CODEX_AUTONOMOUS_REPO_CREATION.md',
  'docs/REAL_LIBTORRENT_IMPLEMENTATION_TASKS.md',
  'tools/github/milestones.json',
  'tools/github/backlog-issues.json',
  'tools/github/repo-ruleset-main.json',
  'tools/github/required-secrets.json',
  'scripts/github-doctor.mjs',
  'scripts/github-init-repo.mjs',
  'scripts/github-apply-labels.mjs',
  'scripts/github-create-milestones.mjs',
  'scripts/github-create-backlog-issues.mjs',
  'scripts/github-apply-ruleset.mjs',
  'scripts/github-secrets-check.mjs'
];
let ok=true;
for(const f of required){if(!existsSync(f)){console.error(`MISSING ${f}`); ok=false}}
const pkg=JSON.parse(readFileSync('package.json','utf8'));
for(const s of ['github:doctor','github:init','github:labels','github:milestones','github:issues','github:rules','github:secrets:check','verify:v10','audit:v10']){
 if(!pkg.scripts?.[s]){console.error(`MISSING package script ${s}`); ok=false}
}
if(!ok) process.exit(1);
console.log('v10 production execution scaffold OK');
