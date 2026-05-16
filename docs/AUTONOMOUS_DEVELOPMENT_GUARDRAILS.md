# Autonomous Development Guardrails for Codex

## What Codex is allowed to automate

- repository scanning
- code generation
- test generation
- documentation updates
- safe dependency installation using official package managers
- local project bootstrap scripts
- running linters, tests, and builds
- collecting design references from approved web sources
- updating the skills registry and skills page

## What Codex must NOT do

- bypass operating system permissions
- self-authorize privileged actions without user or policy approval
- disable security controls silently
- run arbitrary downloaded scripts from unknown sources
- expose local services to the public network by default
- store secrets in the repository

## Safe autonomy model

Codex should operate in a high-autonomy mode only within:

- repo-scoped instructions
- sandbox and approval settings chosen by the user
- auditable scripts in `scripts/`
- explicit dependency policies

## Codex CLI launching

The repo may include helper scripts to launch Codex CLI with the right profiles, but the user/environment remains responsible for authentication and permission policy.

## Permissions policy

If the user wants fewer interruptions, configure Codex approval and sandbox modes explicitly. Do not attempt to “skip permissions” by hacking around them.
