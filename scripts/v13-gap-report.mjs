import fs from 'node:fs';
const score = JSON.parse(fs.readFileSync('tools/production/v13-senior-scorecard.json', 'utf8'));
console.log('V13 Senior Scorecard');
console.log(JSON.stringify(score.scores, null, 2));
console.log('\nCritical remaining gaps:');
for (const gap of score.critical_remaining_gaps) console.log(`- ${gap}`);
process.exit(0);
