# GitHub Automation Runbook

## Objective

Create and harden the GitHub repository with repeatable scripts.

## Required local tools

- git
- GitHub CLI (`gh`)
- Node.js
- pnpm

## Authentication

The scripts require you to authenticate GitHub CLI first:

```bash
gh auth login
```

Codex must not bypass this. Authentication belongs to the user.

## Safe dry-run default

Most GitHub automation scripts default to dry-run. Use `--execute` only after reading the planned actions.

## Recommended sequence

```bash
pnpm github:doctor
pnpm github:init -- --owner YOUR_GITHUB_USER --repo lumatorrent --visibility public --execute
pnpm github:labels -- --owner YOUR_GITHUB_USER --repo lumatorrent --execute
pnpm github:milestones -- --owner YOUR_GITHUB_USER --repo lumatorrent --execute
pnpm github:issues -- --owner YOUR_GITHUB_USER --repo lumatorrent --execute
pnpm github:rules -- --owner YOUR_GITHUB_USER --repo lumatorrent --execute
pnpm github:secrets:check
```

## What gets automated

- git initialization if needed
- GitHub repo creation
- remote origin setup
- initial push
- labels
- milestones
- backlog issues
- branch protection/ruleset where permissions allow
- required secret checklist validation

## What is not automated

- creating private signing certificates
- entering GitHub credentials
- bypassing owner/admin permission checks
- enabling paid GitHub features unavailable to the account
