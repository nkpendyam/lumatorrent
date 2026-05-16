import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("tools/production/production-gaps-v12.json", "utf8"));
console.log("# V12 production gaps");
for (const gap of data.remainingGaps) console.log(`- [${gap.severity}] ${gap.area}: ${gap.gap}`);
