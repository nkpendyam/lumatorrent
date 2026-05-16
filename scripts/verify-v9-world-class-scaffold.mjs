import { existsSync, readFileSync } from "node:fs";

const required = [
  "docs/WORLD_CLASS_PRODUCT_STRATEGY.md",
  "docs/SENIOR_ENGINEERING_EXECUTION_STANDARD.md",
  "docs/CODEX_EXECUTION_COMMAND_CENTER.md",
  "docs/ENGINE_CONTRACT_STRONG_SPEC.md",
  "docs/LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK.md",
  "docs/UI_WORLD_CLASS_SCREEN_BLUEPRINTS.md",
  "docs/DESIGN_TOKEN_CONTRACT.md",
  "docs/QA_WORLD_CLASS_TEST_MATRIX.md",
  "contracts/engine/openapi-lite.json",
  "contracts/engine/events.schema.json",
  "contracts/engine/errors.schema.json",
  "apps/desktop/src/app/AppShell.tsx",
  "apps/desktop/src/features/downloads/DownloadInspector.tsx",
  "apps/desktop/src/features/settings/SettingsPage.tsx",
  "packages/shared/src/healthScore.ts",
  "apps/native-engine/CMakePresets.json",
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing v9 files:\n${missing.join("\n")}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (!pkg.scripts["codex:models"]?.includes("codex-model-router-help.mjs")) {
  console.error("codex:models script regression detected");
  process.exit(1);
}
console.log("v9 world-class scaffold OK");
