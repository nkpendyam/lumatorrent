import { readFileSync } from "node:fs";
const text = readFileSync("docs/CODEX_TASKS.md", "utf8");
const next = text.split("\n").find((line) => line.trim().startsWith("- [ ]"));
console.log(next ? next.replace("- [ ]", "Next:").trim() : "All visible tasks are checked.");
