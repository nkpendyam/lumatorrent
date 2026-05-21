import { existsSync } from "node:fs";

const required = [
  "README.md",
  "docs/PRODUCT_REQUIREMENTS.md",
  "docs/ARCHITECTURE.md",
  "docs/PHASE_MASTER_PLAN.md",
  "docs/DOCS_INDEX.md",
  "docs/FRONTEND_ARCHITECTURE.md",
  "docs/BACKEND_ARCHITECTURE.md",
  "docs/ENGINE_API.md",
  "docs/ENGINE_IMPLEMENTATION_DAG.md",
  "docs/UX_DESIGN_SYSTEM.md",
  "docs/UX_SCREEN_SPECS.md",
  "docs/THREAT_MODEL.md",
  "docs/PRODUCTION_DEFINITION_OF_DONE.md",
  "docs/PRODUCTION_GAP_REGISTER.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/PLATFORM_COMPATIBILITY.md",
  "apps/desktop/package.json",
  "apps/desktop/src/app/App.tsx",
  "apps/desktop/src/api/engineClient.ts",
  "apps/desktop/src-tauri/Cargo.toml",
  "apps/engine/Cargo.toml",
  "apps/engine/src/main.rs",
  "packages/shared/src/types.ts",
  "packages/shared/src/pathSafety.ts",
  ".github/workflows/ci.yml",
  ".github/workflows/security.yml",
  ".github/dependabot.yml",
  "tools/github-labels.json",
  "scripts/bootstrap.sh",
  "scripts/bootstrap.ps1",
  "scripts/doctor.mjs",
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required project files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}
console.log("Project structure OK");
