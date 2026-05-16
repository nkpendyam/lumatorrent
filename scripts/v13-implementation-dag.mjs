import fs from "node:fs";
const dag = JSON.parse(fs.readFileSync("tools/production/v13-implementation-dag.json", "utf8"));
for (const node of dag.nodes) {
  console.log(`${node.id}: ${node.name}`);
  console.log(`  depends_on: ${node.depends_on.length ? node.depends_on.join(", ") : "none"}`);
}
