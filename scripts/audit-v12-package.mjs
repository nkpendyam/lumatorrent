import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const files = walk(".");
const md = files.filter((f) => f.endsWith(".md")).length;
const scripts = files.filter((f) => f.startsWith("scripts/") && f.endsWith(".mjs")).length;
const workflows = files.filter((f) => f.startsWith(".github/workflows/")).length;
console.log(
  JSON.stringify(
    { files: files.length, markdownDocs: md, nodeScripts: scripts, workflows },
    null,
    2,
  ),
);
