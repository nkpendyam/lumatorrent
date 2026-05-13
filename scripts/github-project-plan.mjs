import fs from "node:fs";
const execute = process.argv.includes("--execute");
const cfg = JSON.parse(fs.readFileSync("tools/github/project-board.json", "utf8"));
console.log(`GitHub Project plan: ${cfg.projectName}`);
console.log("Dry-run commands are intentionally conservative.");
console.log('1. gh project create --owner <OWNER> --title "' + cfg.projectName + '"');
console.log("2. Add fields: " + cfg.fields.join(", "));
console.log("3. Add views: " + cfg.views.join(", "));
if (execute) {
  console.log(
    "Execution is not implemented because gh project permissions vary by account/org. Use this as a reviewed plan.",
  );
}
