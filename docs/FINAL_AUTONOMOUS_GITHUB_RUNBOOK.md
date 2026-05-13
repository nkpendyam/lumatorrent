# Final Autonomous GitHub Runbook

## Requirements

- Git installed.
- GitHub CLI installed.
- User authenticated with `gh auth login`.
- For GitHub Projects, run `gh auth refresh -s project`.
- User chooses owner, repo name, and visibility.

## Safe automation commands

```bash
pnpm github:doctor
pnpm github:plan
pnpm github:init -- --owner nkpendyam --repo lumatorrent --visibility public --execute
pnpm github:labels -- --owner nkpendyam --repo lumatorrent --execute
pnpm github:milestones -- --owner nkpendyam --repo lumatorrent --execute
pnpm github:issues -- --owner nkpendyam --repo lumatorrent --execute
pnpm github:rules -- --owner nkpendyam --repo lumatorrent --execute
pnpm github:project:plan
```

## What cannot be automated safely

- Logging into GitHub without the user.
- Creating private signing keys.
- Uploading secrets without explicit owner control.
- Bypassing branch protection limitations.
- Bypassing Codex sandbox approvals.

## Production GitHub setup

Enable:

- branch protection
- required CI
- signed releases
- Dependabot
- CodeQL
- issue templates
- PR template
- labels
- milestones
- project board
- security policy
