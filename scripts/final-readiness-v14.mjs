import fs from "node:fs";

const gaps = JSON.parse(fs.readFileSync("tools/production/v14-final-gap-register.json", "utf8"));
const critical = gaps.filter((g) => g.severity === "critical");
console.log("Final readiness reality check:");
console.log(`Critical implementation gaps remaining: ${critical.length}`);
for (const gap of critical) {
  console.log(`- ${gap.id}: ${gap.title} -> ${gap.exit}`);
}
console.log("");
console.log(
  "Conclusion: scaffold is ready for Codex; production app still requires implementation milestones.",
);
