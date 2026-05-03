import { spawnSync } from "node:child_process";
const commands = ["git", "node", "pnpm", "rustc", "cargo", "cmake"];
let missing = false;
for (const cmd of commands) {
  const result = spawnSync(cmd, ["--version"], { encoding: "utf8" });
  if (result.error) {
    console.log(`missing: ${cmd}`);
    missing = true;
  } else {
    console.log(`${cmd}: ${result.stdout.trim().split("\n")[0]}`);
  }
}
process.exit(missing ? 1 : 0);
