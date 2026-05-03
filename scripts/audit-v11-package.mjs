#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const files = walk(process.cwd());
const md = files.filter(f => f.endsWith('.md')).length;
const scripts = files.filter(f => f.includes(`${path.sep}scripts${path.sep}`)).length;
const workflows = files.filter(f => f.includes(`${path.sep}.github${path.sep}workflows${path.sep}`)).length;
const contracts = files.filter(f => f.includes(`${path.sep}contracts${path.sep}`)).length;
console.log(JSON.stringify({ files: files.length, markdownDocs: md, scripts, workflows, contracts }, null, 2));
