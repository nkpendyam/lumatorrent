#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const execute = process.argv.includes('--execute');
const cmds = [
  ['corepack', ['enable']],
  ['corepack', ['prepare', 'pnpm@latest', '--activate']],
  ['pnpm', ['install']]
];
for (const [cmd,args] of cmds) {
  console.log(`${execute ? 'RUN' : 'DRY'}: ${cmd} ${args.join(' ')}`);
  if (execute) {
    const r=spawnSync(cmd,args,{stdio:'inherit'});
    if (r.status!==0) process.exit(r.status ?? 1);
  }
}
if (!execute) console.log('\nDry run only. Add --execute to run safe package-manager commands.');
