# Codex Autonomous Repo Creation

## What "autonomous" means here
Codex can run repo setup scripts after you have installed GitHub CLI and authenticated it.

## What it does not mean
It does not mean Codex can log into GitHub for you, bypass MFA, grant itself admin permissions, or skip operating-system permission prompts.

## Fast path
```bash
pnpm github:doctor
pnpm github:init -- --owner YOUR_USER --repo lumatorrent --visibility public --execute
pnpm github:labels -- --owner YOUR_USER --repo lumatorrent --execute
pnpm github:milestones -- --owner YOUR_USER --repo lumatorrent --execute
pnpm github:issues -- --owner YOUR_USER --repo lumatorrent --execute
pnpm github:rules -- --owner YOUR_USER --repo lumatorrent --execute
```

## Codex prompt
```text
Run the GitHub automation runbook in dry-run first. Show me the planned changes. If the dry-run is clean, run with --execute. Do not request or store secrets. Stop if GitHub CLI is not authenticated.
```
