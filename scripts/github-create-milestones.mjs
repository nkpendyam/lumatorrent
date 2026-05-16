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
const milestones = JSON.parse(readFileSync("tools/github/milestones.json", "utf8"));
for (const m of milestones) {
  const body = { title: m.title, description: m.description || "" };
  const argv = [
    "api",
    `repos/${owner}/${repo}/milestones`,
    "-X",
    "POST",
    "-f",
    `title=${body.title}`,
    "-f",
    `description=${body.description}`,
  ];
  console.log(`$ gh ${argv.join(" ")}`);
  if (execute) {
    const res = spawnSync("gh", argv, { stdio: "inherit" });
    if (res.status !== 0) console.warn(`Milestone may already exist: ${m.title}`);
  }
}
if (!execute) console.log("Dry run only. Add --execute to run.");
