#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const args = new Map();
for (let i=2; i<process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const key = a.slice(2);
    const next = process.argv[i+1];
    if (!next || next.startsWith('--')) args.set(key, true); else { args.set(key, next); i++; }
  }
}
const owner = args.get('owner');
const repo = args.get('repo') || 'lumatorrent';
const visibility = args.get('visibility') || 'public';
const execute = args.has('execute');
if (!owner) {
  console.error('Usage: node scripts/github-init-repo.mjs --owner OWNER --repo lumatorrent --visibility public|private [--execute]');
  process.exit(2);
}
const full = `${owner}/${repo}`;
const commands = [];
commands.push(['git', ['init']]);
commands.push(['git', ['branch', '-M', 'main']]);
commands.push(['gh', ['repo', 'create', full, `--${visibility}`, '--source=.', '--remote=origin', '--push']]);
console.log(`Plan to initialize and push repository: ${full}`);
for (const [cmd, argv] of commands) console.log(`$ ${cmd} ${argv.join(' ')}`);
if (!execute) {
  console.log('
Dry run only. Add --execute to run.');
  process.exit(0);
}
const auth = spawnSync('gh', ['auth', 'status'], { stdio: 'inherit' });
if (auth.status !== 0) process.exit(auth.status ?? 1);
for (const [cmd, argv] of commands) {
  const res = spawnSync(cmd, argv, { stdio: 'inherit' });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
