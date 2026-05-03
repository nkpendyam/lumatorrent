import fs from "node:fs";
const gaps = JSON.parse(fs.readFileSync("tools/production/v14-final-gap-register.json", "utf8"));
for (const gap of gaps) {
  console.log(`[${gap.severity}] ${gap.id}: ${gap.title}`);
  console.log(`  Exit: ${gap.exit}`);
}
