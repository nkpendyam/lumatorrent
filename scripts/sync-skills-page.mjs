#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, ".codex", "skills", "skills-registry.json");
const skillsPath = path.join(root, "docs", "SKILLS.md");

function fail(message) {
  console.error(`sync-skills-page: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(registryPath)) fail(`missing ${registryPath}`);
if (!fs.existsSync(skillsPath)) fail(`missing ${skillsPath}`);

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
if (!Array.isArray(registry.skills)) fail("registry.skills must be an array");

const rows = registry.skills.map((skill) => {
  for (const key of [
    "name",
    "purpose",
    "docsUrl",
    "install",
    "verify",
    "status",
    "securityNotes",
  ]) {
    if (!skill[key]) fail(`skill ${skill.name ?? "<unknown>"} missing ${key}`);
  }
  const cells = [
    skill.name,
    skill.purpose,
    skill.docsUrl,
    skill.install,
    skill.verify,
    skill.status,
    skill.securityNotes,
  ].map(escapeMarkdownTableCell);
  return `| ${cells.join(" | ")} |`;
});

function escapeMarkdownTableCell(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

const table = [
  "| Skill | Purpose | Docs | Install | Verify | Status | Security notes |",
  "|---|---|---|---|---|---|---|",
  ...rows,
].join("\n");

const start = "<!-- SKILLS_TABLE_START -->";
const end = "<!-- SKILLS_TABLE_END -->";
const current = fs.readFileSync(skillsPath, "utf8");
const startIdx = current.indexOf(start);
const endIdx = current.indexOf(end);
if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  fail("docs/SKILLS.md missing table markers");
}

const next = `${current.slice(0, startIdx + start.length)}\n${table}\n${current.slice(endIdx)}`;
fs.writeFileSync(skillsPath, next);
console.log(`Updated docs/SKILLS.md with ${registry.skills.length} skills.`);
