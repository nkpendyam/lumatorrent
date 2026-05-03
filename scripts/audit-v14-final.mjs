import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(".");
const md = files.filter((f) => f.endsWith(".md")).length;
const scripts = files.filter((f) => f.startsWith("scripts/") && f.endsWith(".mjs")).length;
const workflows = files.filter((f) => f.startsWith(".github/workflows/")).length;
const contracts = files.filter((f) => f.startsWith("contracts/engine/")).length;

const report = {
  files: files.length,
  markdown_docs: md,
  node_scripts: scripts,
  github_workflows: workflows,
  engine_contract_files: contracts,
  final_handoff_present: fs.existsSync("CODEX_FINAL_HANDOFF.md"),
  final_opinion_present: fs.existsSync("docs/FINAL_OPINION_FOR_CODEX.md"),
};

console.log(JSON.stringify(report, null, 2));
