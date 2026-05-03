import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  let out = [];
  for (const item of readdirSync(dir)) {
    if (["node_modules", ".git", "target", "dist"].includes(item)) continue;
    const full = join(dir, item);
    const st = statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(".");
const markdown = files.filter((f) => f.endsWith(".md")).length;
const workflows = files.filter((f) => f.includes(".github/workflows/")).length;
const scripts = files.filter((f) => f.includes("scripts/")).length;
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const report = {
  files: files.length,
  markdown_docs: markdown,
  github_workflows: workflows,
  scripts,
  codex_models_script: packageJson.scripts?.["codex:models"],
  has_design_bible: existsSync("docs/DESIGN_BIBLE.md"),
  has_task_tree: existsSync("docs/CODEX_AUTONOMOUS_TASK_TREE.md"),
  has_test_matrix: existsSync("docs/TEST_COVERAGE_MATRIX.md")
};

console.log(JSON.stringify(report, null, 2));
