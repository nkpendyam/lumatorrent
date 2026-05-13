import { execSync } from "node:child_process";

const commands = [
  ["git", "git --version"],
  ["node", "node --version"],
  ["pnpm", "pnpm --version"],
  ["rustc", "rustc --version"],
  ["cargo", "cargo --version"],
  ["cmake", "cmake --version"],
];

let missing = false;

for (const [name, command] of commands) {
  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    console.log(`${name}: ${output.trim().split("\n")[0]}`);
  } catch {
    console.log(`missing: ${name}`);
    missing = true;
  }
}

process.exit(missing ? 1 : 0);
