import { execSync } from "node:child_process";
const commands = [
  ["node", "node --version"],
  ["git", "git --version"],
  ["pnpm", "pnpm --version"],
  ["rustc", "rustc --version"],
  ["cargo", "cargo --version"],
  ["gh", "gh --version"],
];
for (const [name, cmd] of commands) {
  try {
    console.log(
      `${name}: ${execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n")[0]}`,
    );
  } catch {
    console.log(`${name}: missing or not on PATH`);
  }
}
console.log("\nUse milestone shards; do not ask Codex Plus to build everything in one run.");
