#!/usr/bin/env node
const milestone = process.argv.find((a) => a.startsWith("--milestone="))?.split("=")[1] ?? "M0";
console.log(`# Codex mission control`);
console.log(`Milestone: ${milestone}`);
console.log(`\nRead first:`);
console.log(`- AGENTS.md`);
console.log(`- docs/CODEX_AUTONOMOUS_EXECUTION_MANUAL.md`);
console.log(`- docs/MILESTONE_ACCEPTANCE_GATES.md`);
console.log(`- docs/PRODUCTION_DEFINITION_OF_DONE.md`);
console.log(`\nInstruction:`);
console.log(
  `Work only on ${milestone}. Implement, test, document, and stop. Do not proceed to the next milestone.`,
);
