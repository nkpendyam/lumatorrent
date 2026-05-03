#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const commands=[
  ['node',['scripts/verify-project.mjs']],
  ['node',['scripts/verify-v9-world-class-scaffold.mjs']],
  ['node',['scripts/verify-v10-production-execution.mjs']],
  ['node',['scripts/validate-contracts.mjs']],
  ['node',['scripts/test-engine-contracts.mjs']],
  ['node',['scripts/performance-budget-check.mjs']]
];
for(const [cmd,args] of commands){
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const res=spawnSync(cmd,args,{stdio:'inherit'});
  if(res.status!==0) process.exit(res.status??1);
}
console.log('Full production preflight passed');
