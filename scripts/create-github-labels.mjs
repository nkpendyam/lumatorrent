import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const labels = JSON.parse(readFileSync("tools/github-labels.json", "utf8"));
const hasGh = spawnSync("gh", ["--version"], { encoding: "utf8" });
if (hasGh.error) {
  console.error("GitHub CLI missing. Install gh first.");
  process.exit(1);
}

for (const label of labels) {
  const args = [
    "label",
    "create",
    label.name,
    "--color",
    label.color,
    "--description",
    label.description,
    "--force"
  ];
  const result = spawnSync("gh", args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
