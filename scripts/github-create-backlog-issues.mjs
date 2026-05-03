#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
const args=new Map(); for(let i=2;i<process.argv.length;i++){const a=process.argv[i]; if(a.startsWith('--')){const k=a.slice(2), n=process.argv[i+1]; if(!n||n.startsWith('--')) args.set(k,true); else {args.set(k,n); i++;}}}
const owner=args.get('owner'), repo=args.get('repo'), execute=args.has('execute');
if(!owner||!repo){console.error('Usage: --owner OWNER --repo REPO [--execute]'); process.exit(2)}
const issues=JSON.parse(readFileSync('tools/github/backlog-issues.json','utf8'));
for(const issue of issues){
  const labels=(issue.labels||[]).join(',');
  const argv=['issue','create','--repo',`${owner}/${repo}`,'--title',issue.title,'--body',issue.body];
  if(labels) argv.push('--label', labels);
  if(issue.milestone) argv.push('--milestone', issue.milestone);
  console.log(`$ gh ${argv.map(x=>x.includes(' ')?JSON.stringify(x):x).join(' ')}`);
  if(execute){const res=spawnSync('gh',argv,{stdio:'inherit'}); if(res.status!==0) console.warn(`Issue create failed: ${issue.title}`)}
}
if(!execute) console.log('Dry run only. Add --execute to run.');
