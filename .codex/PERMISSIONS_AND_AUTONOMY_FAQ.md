# Permissions and Autonomy FAQ

## Can Codex skip all permissions by authorizing itself?

No. This repository intentionally forbids bypassing permissions or self-authorizing privileged actions.

## How do we reduce interruptions safely?

- configure sandbox/approval policies up front
- use audited scripts for bootstrap and builds
- keep tasks repo-local where possible
- use profiles for scan / implement / review

## Can Codex open the CLI automatically?

It can be launched through helper scripts, but environment authentication and policy setup must remain under user control.
