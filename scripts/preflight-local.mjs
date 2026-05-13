#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const tools = [
  ["git", ["--version"]],
  ["node", ["--version"]],
  ["pnpm", ["--version"]],
  ["rustc", ["--version"]],
  ["cargo", ["--version"]],
  ["cmake", ["--version"]],
  ["gh", ["--version"]],
];

let missing = [];
for (const [cmd, args] of tools) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) missing.push(cmd);
  else console.log(`${cmd}: ${String(r.stdout).split("\n")[0]}`);
}

if (missing.length) {
  console.log("\nMissing tools:", missing.join(", "));
  console.log("\nSuggested installation sources:");
  console.log("- Node.js: official Node installer or fnm/nvm");
  console.log("- pnpm: corepack enable && corepack prepare pnpm@latest --activate");
  console.log("- Rust: rustup");
  console.log("- CMake: official installer or package manager");
  console.log("- GitHub CLI: official gh installer or package manager");
  process.exit(1);
}
console.log("\nLocal preflight OK");
