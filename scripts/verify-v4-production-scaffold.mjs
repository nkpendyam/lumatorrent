#!/usr/bin/env node
import { existsSync } from "node:fs";

const required = [
  ".codex/PRODUCTION_ENGINEERING_PLAYBOOK.md",
  "apps/native-engine/CMakeLists.txt",
  "apps/native-engine/src/main.cpp",
  "apps/native-engine/src/engine_session.cpp",
  "docs/LIBTORRENT_PRODUCTION_INTEGRATION.md",
  "docs/NATIVE_ENGINE_API.md",
  "docs/PACKAGING_AND_DISTRIBUTION.md",
  "docs/CODE_SIGNING_AND_NOTARIZATION.md",
  "docs/REAL_NETWORK_QA_LAB.md",
  "docs/PLATFORM_RELEASE_MATRIX.md",
  "docs/CRASH_RECOVERY_AND_RESUME.md",
  "scripts/setup-libtorrent.sh",
  "scripts/setup-libtorrent.ps1",
  "scripts/build-native-engine.sh",
  "scripts/build-native-engine.ps1",
  "scripts/doctor-production.mjs",
  ".github/workflows/native-engine.yml",
  ".github/workflows/package-desktop.yml",
  ".github/workflows/release-signed-template.yml",
  "tests/network/README.md",
];

const missing = required.filter((p) => !existsSync(p));
if (missing.length) {
  console.error("Missing v4 production scaffold files:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}
console.log("v4 production scaffold OK");
