#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function have(cmd) {
  const result = spawnSync(process.platform === "win32" ? "where" : "which", [cmd], {
    encoding: "utf8",
  });
  return result.status === 0;
}

const checks = ["git", "gh", "node", "pnpm"];
let ok = true;
for (const cmd of checks) {
  const present = have(cmd);
  console.log(`${present ? "OK" : "MISSING"} ${cmd}`);
  if (!present) ok = false;
}
if (have("gh")) {
  const auth = spawnSync("gh", ["auth", "status"], { encoding: "utf8", stdio: "pipe" });
  console.log(
    auth.status === 0 ? "OK gh authenticated" : "MISSING gh authentication: run gh auth login",
  );
  if (auth.status !== 0) ok = false;
}
process.exit(ok ? 0 : 1);
