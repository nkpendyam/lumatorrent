import fs from 'node:fs';
import path from 'node:path';

const required = [
  'docs/V12_FINAL_AUDIT_AND_MISSING_PIECES.md',
  'docs/CODEX_CONTEXT_PACKS.md',
  'docs/CODEX_ONE_RUN_REALITY_CHECK.md',
  'docs/MILESTONE_SHARDS_FOR_PLUS.md',
  'docs/ACTUAL_IMPLEMENTATION_BLUEPRINT.md',
  'docs/ADD_TORRENT_IMPLEMENTATION_SPEC.md',
  'docs/MAGNET_METADATA_IMPLEMENTATION_SPEC.md',
  'docs/SAFE_DELETE_TO_TRASH_IMPLEMENTATION_SPEC.md',
  'docs/DOWNLOAD_DOCTOR_ALGORITHM_SPEC.md',
  'docs/PORT_CHECKER_AND_NETWORK_DIAGNOSTICS_SPEC.md',
  'docs/TRACKER_DHT_DIAGNOSTICS_SPEC.md',
  'docs/SETTINGS_PERSISTENCE_IMPLEMENTATION_SPEC.md',
  'docs/CRASH_RECOVERY_IMPLEMENTATION_SPEC.md',
  'docs/ENGINE_EVENT_STREAM_IMPLEMENTATION_SPEC.md',
  'docs/GITHUB_PROJECT_BOARD_AUTOMATION.md',
  'docs/KNOWN_NON_AUTOMATABLE_ITEMS.md',
  '.codex/requirements.example.toml',
  'tools/codex/context-packs.json',
  'tools/production/quality-gates-v12.json',
  'tools/production/production-gaps-v12.json',
  'tools/github/project-board.json',
  'tools/testing/os-qa-matrix.json'
];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error('Missing v12 files:\n' + missing.join('\n'));
  process.exit(1);
}
console.log('v12 final scaffold OK');
