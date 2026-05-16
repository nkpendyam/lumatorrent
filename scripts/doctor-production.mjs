#!/usr/bin/env node
import { execSync } from "node:child_process";

const checks = [
  ["node", "node --version"],
  ["pnpm", "pnpm --version"],
  ["rustc", "rustc --version"],
  ["cargo", "cargo --version"],
  ["cmake", "cmake --version"],
  ["git", "git --version"],
];

let failed = false;
for (const [cmd, command] of checks) {
  try {
    const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log(`OK ${cmd}: ${output.split("\n")[0]}`);
  } catch {
    failed = true;
    console.error(`Missing required tool: ${cmd}`);
  }
}

const optional = [
  ["ninja", "ninja --version"],
  ["pkg-config", "pkg-config --version"],
];
for (const [cmd, command] of optional) {
  try {
    const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log(`OK ${cmd}: ${output.split("\n")[0]}`);
  } catch {
    console.warn(`WARN optional tool not found: ${cmd}`);
  }
}

if (failed) {
  console.error("\nProduction doctor failed. Install missing required tools and rerun.");
  process.exit(1);
}

console.log(
  "\nProduction doctor passed. Native libtorrent headers are checked by scripts/build-native-engine.* in libtorrent mode.",
);
