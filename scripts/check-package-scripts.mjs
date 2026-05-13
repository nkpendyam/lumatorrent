#!/usr/bin/env node
import fs from "node:fs";
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
let ok = true;
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  const m = cmd.match(/node (scripts\/[^\s]+)/);
  if (m && !fs.existsSync(m[1])) {
    console.error(`Missing script target for ${name}: ${m[1]}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log("All package.json node script references OK");
