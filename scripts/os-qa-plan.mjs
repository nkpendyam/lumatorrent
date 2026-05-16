import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("tools/testing/os-qa-matrix.json", "utf8"));
console.log("# OS QA Matrix");
for (const platform of data.platforms) {
  console.log(`\n## ${platform}`);
  for (const scenario of data.scenarios) console.log(`- ${scenario}`);
}
