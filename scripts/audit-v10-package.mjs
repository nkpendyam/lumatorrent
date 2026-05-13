#!/usr/bin/env node
import { readdirSync, statSync, existsSync } from "node:fs";
function walk(dir) {
  let out = [];
  for (const f of readdirSync(dir)) {
    const p = `${dir}/${f}`;
    const st = statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}
const files = walk(".");
const md = files.filter((f) => f.endsWith(".md")).length;
const workflows = files.filter(
  (f) => f.startsWith("./.github/workflows/") && f.endsWith(".yml"),
).length;
const scripts = files.filter((f) => f.startsWith("./scripts/")).length;
const docsNeeded = [
  "docs/PRODUCTION_GAP_REGISTER.md",
  "docs/PRODUCTION_READINESS_SCORECARD.md",
  "docs/GITHUB_AUTOMATION_RUNBOOK.md",
];
console.log(
  JSON.stringify({ files: files.length, markdown_docs: md, workflows, scripts }, null, 2),
);
for (const d of docsNeeded) {
  if (!existsSync(d)) {
    console.error(`Missing ${d}`);
    process.exit(1);
  }
}
console.log("v10 audit completed");
