import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const files = walk(".").filter((p) => !p.includes("node_modules") && !p.includes("/.git/"));
const md = files.filter((p) => p.endsWith(".md")).length;
const workflows = files.filter((p) => p.includes(".github/workflows/")).length;
const scripts = files.filter((p) => p.startsWith("scripts/")).length;
const contracts = files.filter((p) => p.startsWith("contracts/")).length;
const result = { files: files.length, markdownDocs: md, workflows, scripts, contracts };
console.log(JSON.stringify(result, null, 2));
if (!existsSync("docs/V9_WORLD_CLASS_AUDIT.md")) process.exit(1);
