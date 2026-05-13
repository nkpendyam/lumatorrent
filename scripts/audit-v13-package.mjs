import fs from "node:fs";
import path from "node:path";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = walk(".");
const md = files.filter((f) => f.endsWith(".md")).length;
const scripts = files.filter((f) => f.startsWith("scripts/") && f.endsWith(".mjs")).length;
const workflows = files.filter((f) => f.startsWith(".github/workflows/")).length;
const contracts = files.filter((f) => f.startsWith("contracts/engine/")).length;
console.log(
  JSON.stringify(
    {
      files: files.length,
      markdown_docs: md,
      node_scripts: scripts,
      workflows,
      engine_contract_files: contracts,
    },
    null,
    2,
  ),
);
