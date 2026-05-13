#!/usr/bin/env node
import { readFileSync } from "node:fs";
const secrets = JSON.parse(readFileSync("tools/github/required-secrets.json", "utf8"));
console.log("Required GitHub secrets for production releases:");
for (const s of secrets) {
  console.log(`- ${s.name}: ${s.purpose} (${s.required_for})`);
}
console.log(
  "\nThis script does not read or store secret values. Configure them in GitHub repository settings.",
);
