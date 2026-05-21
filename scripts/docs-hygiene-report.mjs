import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const protectedPrefixes = [
  ".github/",
  "apps/",
  "docs/ADR/",
  "docs/research/",
  "docs/PROMPTS/",
  "docs/AI/",
  "tests/",
];

const protectedFiles = new Set([
  "README.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "docs/DOCS_INDEX.md",
  "docs/PHASE_MASTER_PLAN.md",
  "docs/PRODUCT_REQUIREMENTS.md",
  "docs/ARCHITECTURE.md",
  "docs/PRODUCTION_GAP_REGISTER.md",
  "docs/MILESTONE_ACCEPTANCE_GATES.md",
  "docs/PRODUCTION_DEFINITION_OF_DONE.md",
  "docs/TEST_COVERAGE_MATRIX.md",
  "docs/ENGINE_IMPLEMENTATION_DAG.md",
  "docs/LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK.md",
  "docs/REAL_LIBTORRENT_IMPLEMENTATION_TASKS.md",
  "docs/THREAT_MODEL.md",
  "docs/SECURITY_MODEL.md",
  "docs/SAFE_DELETE_TO_TRASH_IMPLEMENTATION_SPEC.md",
  "docs/DESIGN_BIBLE.md",
  "docs/UI_COMPONENT_SPEC_LIBRARY.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/CODE_SIGNING_AND_NOTARIZATION.md",
]);

const textExtensions = new Set([
  ".c",
  ".cpp",
  ".css",
  ".h",
  ".hpp",
  ".html",
  ".json",
  ".md",
  ".mjs",
  ".rs",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
]);

function gitLines(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replaceAll("\\", "/"));
}

function isProtected(file) {
  return protectedFiles.has(file) || protectedPrefixes.some((prefix) => file.startsWith(prefix));
}

function countNeedle(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

const tracked = gitLines(["ls-files"]).filter((file) => existsSync(file));
const markdown = tracked.filter((file) => file.endsWith(".md"));
const searchable = tracked.filter((file) => textExtensions.has(path.extname(file)));
const searchableContent = searchable.map((file) => ({
  file,
  content: readFileSync(file, "utf8"),
}));

const rows = markdown
  .map((file) => {
    const basename = path.basename(file);
    const directReferences = searchableContent
      .filter(({ file: source }) => source !== file && source !== "docs/DOCS_INDEX.md")
      .reduce(
        (total, { content }) =>
          total + countNeedle(content, file) + countNeedle(content, file.replaceAll("/", "\\")),
        0,
      );
    const basenameReferences = searchableContent
      .filter(({ file: source }) => source !== file && source !== "docs/DOCS_INDEX.md")
      .reduce((total, { content }) => total + countNeedle(content, basename), 0);

    return {
      file,
      size: statSync(file).size,
      directReferences,
      basenameReferences,
      protected: isProtected(file),
    };
  })
  .sort((left, right) => {
    if (left.protected !== right.protected) return Number(left.protected) - Number(right.protected);
    if (left.directReferences !== right.directReferences) {
      return left.directReferences - right.directReferences;
    }
    if (left.basenameReferences !== right.basenameReferences) {
      return left.basenameReferences - right.basenameReferences;
    }
    return right.size - left.size;
  });

const reviewCandidates = rows.filter(
  (row) => !row.protected && row.directReferences === 0 && row.basenameReferences === 0,
);

console.log("# Docs hygiene report");
console.log(`\nTracked Markdown files: ${markdown.length}`);
console.log(`Review candidates: ${reviewCandidates.length}`);
console.log("\n## Review candidates");
if (reviewCandidates.length === 0) {
  console.log("none");
} else {
  for (const row of reviewCandidates.slice(0, 40)) {
    console.log(`- ${row.file} (${row.size} bytes)`);
  }
}

console.log("\n## Lowest-reference Markdown files");
for (const row of rows.slice(0, 40)) {
  console.log(
    `- ${row.file} | direct=${row.directReferences} basename=${row.basenameReferences} size=${row.size}${row.protected ? " protected" : ""}`,
  );
}
