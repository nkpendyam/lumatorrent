#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";
const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) {
    const k = a.slice(2),
      n = process.argv[i + 1];
    if (!n || n.startsWith("--")) args.set(k, true);
    else {
      args.set(k, n);
      i++;
    }
  }
}
const owner = args.get("owner"),
  repo = args.get("repo"),
  execute = args.has("execute");
if (!owner || !repo) {
  console.error("Usage: --owner OWNER --repo REPO [--execute]");
  process.exit(2);
}
const payload = "tools/github/repo-ruleset-main.json";
console.log(`Plan: apply repository ruleset from ${payload} to ${owner}/${repo}`);
console.log(`$ gh api repos/${owner}/${repo}/rulesets -X POST --input ${payload}`);
if (!execute) {
  console.log("Dry run only. Add --execute to run.");
  process.exit(0);
}
const res = spawnSync(
  "gh",
  ["api", `repos/${owner}/${repo}/rulesets`, "-X", "POST", "--input", payload],
  { stdio: "inherit" },
);
process.exit(res.status ?? 1);
