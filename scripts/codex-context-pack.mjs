import fs from 'node:fs';
const packName = process.argv[2] ?? 'preflight';
const data = JSON.parse(fs.readFileSync('tools/codex/context-packs.json', 'utf8'));
const pack = data.packs[packName];
if (!pack) {
  console.error(`Unknown pack: ${packName}`);
  console.error(`Available: ${Object.keys(data.packs).join(', ')}`);
  process.exit(1);
}
console.log(`# Codex context pack: ${packName}`);
for (const file of pack) console.log(`- ${file}`);
