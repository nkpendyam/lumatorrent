import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const secretPattern =
  "sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY\\s*=|GITHUB_TOKEN\\s*=|GH_TOKEN\\s*=|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|AWS_SECRET|SECRET_KEY|client_secret|password\\s*=";

function run(command, args, options = {}) {
  try {
    return {
      ok: true,
      stdout: execFileSync(command, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        ...options,
      }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout?.toString().trim() ?? "",
      stderr: error.stderr?.toString().trim() ?? error.message,
      status: error.status,
    };
  }
}

function printBlock(title, value) {
  console.log(`\n## ${title}`);
  console.log(value || "none");
}

const status = run("git", ["status", "--short", "--branch"]);
const trackedFiles = run("git", ["ls-files"]);
const untracked = run("git", ["ls-files", "-o", "--exclude-standard"]);
const trackedIgnored = run("git", ["ls-files", "-ci", "--exclude-standard"]);
const secretScan = run("rg", [
  "-n",
  "--hidden",
  "-g",
  "!node_modules",
  "-g",
  "!target",
  "-g",
  "!dist",
  "-g",
  "!build",
  "-g",
  "!apps/desktop/src-tauri/target",
  "-g",
  "!scripts/repo-hygiene-status.mjs",
  "-e",
  secretPattern,
]);

const trackedList = trackedFiles.stdout ? trackedFiles.stdout.split(/\r?\n/).filter(Boolean) : [];
const largestFiles = trackedList
  .filter((path) => existsSync(path))
  .map((path) => ({ path, size: statSync(path).size }))
  .sort((left, right) => right.size - left.size)
  .slice(0, 15)
  .map(({ path, size }) => `${String(size).padStart(8, " ")}  ${path}`)
  .join("\n");

console.log("# Repo hygiene status");
printBlock("Git status", status.stdout || status.stderr);
printBlock("Tracked file count", String(trackedList.length));
printBlock("Untracked non-ignored files", untracked.stdout);
printBlock("Tracked files matched by ignore rules", trackedIgnored.stdout);
printBlock("Largest tracked files", largestFiles);

if (secretScan.ok) {
  printBlock("Secret-pattern scan", secretScan.stdout);
} else if (secretScan.status === 1) {
  printBlock("Secret-pattern scan", "no matches");
} else {
  printBlock("Secret-pattern scan", `scan failed: ${secretScan.stderr}`);
  process.exitCode = 1;
}
