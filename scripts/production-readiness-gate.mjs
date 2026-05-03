#!/usr/bin/env node
import fs from 'node:fs';
const gates = JSON.parse(fs.readFileSync('tools/production/acceptance-gates.json','utf8'));
console.log('Production readiness gates:');
for (const gate of gates.gates) {
  console.log(`- ${gate.id}: ${gate.name} [${gate.status}]`);
}
const incomplete = gates.gates.filter(g => g.status !== 'complete');
console.log(`\nIncomplete gates: ${incomplete.length}`);
if (incomplete.length) process.exitCode = 1;
