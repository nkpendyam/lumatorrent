#!/usr/bin/env node
import { execSync } from "node:child_process";

const tools = [
  ["git", "git --version"],
  ["node", "node --version"],
  ["pnpm", "pnpm --version"],
  ["rustc", "rustc --version"],
  ["cargo", "cargo --version"],
  ["cmake", "cmake --version"],
  ["gh", "gh --version"],
];

let missing = [];
for (const [cmd, command] of tools) {
  try {
    const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log(`${cmd}: ${String(output).split("\n")[0]}`);
  } catch {
    missing.push(cmd);
  }
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
