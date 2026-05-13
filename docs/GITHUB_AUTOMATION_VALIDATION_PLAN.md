# GitHub Automation Validation Plan

## Required tools

- git
- GitHub CLI `gh`
- Node.js
- pnpm

## Authentication checks

Run:

```
gh auth status
```

For issue/project automation, GitHub CLI may need refreshed scopes depending on the operation.

## Dry-run first

Every GitHub automation script must support dry-run by default and require `--execute` for mutation.

## Repo creation flow

1. `pnpm github:doctor`
2. `pnpm github:plan -- --owner OWNER --repo REPO`
3. `pnpm github:init -- --owner OWNER --repo REPO --visibility public --execute`
4. `pnpm github:labels -- --owner OWNER --repo REPO --execute`
5. `pnpm github:milestones -- --owner OWNER --repo REPO --execute`
6. `pnpm github:issues -- --owner OWNER --repo REPO --execute`
7. `pnpm github:rules -- --owner OWNER --repo REPO --execute`
8. `pnpm github:secrets:check`

## Validation

- repo exists
- main branch exists
- CI workflows visible
- labels exist
- milestones exist
- issues exist
- ruleset/branch protection exists where supported
- required secrets are documented but not committed
