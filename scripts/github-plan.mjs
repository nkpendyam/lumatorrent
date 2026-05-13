#!/usr/bin/env node
const owner = process.argv.find((a) => a.startsWith("--owner="))?.split("=")[1] ?? "OWNER";
const repo = process.argv.find((a) => a.startsWith("--repo="))?.split("=")[1] ?? "lumatorrent";
console.log(`# GitHub automation plan for ${owner}/${repo}`);
console.log(`1. gh auth status`);
console.log(`2. pnpm github:init -- --owner ${owner} --repo ${repo} --visibility public --execute`);
console.log(`3. pnpm github:labels -- --owner ${owner} --repo ${repo} --execute`);
console.log(`4. pnpm github:milestones -- --owner ${owner} --repo ${repo} --execute`);
console.log(`5. pnpm github:issues -- --owner ${owner} --repo ${repo} --execute`);
console.log(`6. pnpm github:rules -- --owner ${owner} --repo ${repo} --execute`);
console.log(`7. pnpm github:secrets:check`);
