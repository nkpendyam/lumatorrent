#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const checks = [
  ["node", ["--version"]],
  ["pnpm", ["--version"]],
  ["rustc", ["--version"]],
  ["cargo", ["--version"]],
  ["cmake", ["--version"]],
  ["git", ["--version"]],
];

let failed = false;
for (const [cmd, args] of checks) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.status !== 0) {
    failed = true;
    console.error(`Missing required tool: ${cmd}`);
  } else {
    const line = (res.stdout || res.stderr).split("\n")[0];
    console.log(`OK ${cmd}: ${line}`);
  }
}

const optional = [
  ["ninja", ["--version"]],
  ["pkg-config", ["--version"]],
];
for (const [cmd, args] of optional) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.status !== 0) {
    console.warn(`WARN optional tool not found: ${cmd}`);
  } else {
    console.log(`OK ${cmd}: ${(res.stdout || res.stderr).split("\n")[0]}`);
  }
}

if (failed) {
  console.error("\nProduction doctor failed. Install missing required tools and rerun.");
  process.exit(1);
}

console.log(
  "\nProduction doctor passed. Native libtorrent headers are checked by scripts/build-native-engine.* in libtorrent mode.",
);
