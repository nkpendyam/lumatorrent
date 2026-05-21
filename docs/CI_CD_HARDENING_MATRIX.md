# CI/CD Hardening Matrix

## Required workflows

- ci.yml: lint/typecheck/test
- codeql.yml: security scan
- contracts.yml: engine contract validation
- native-engine.yml: C++ smoke build
- performance-budget.yml: budget guardrails
- package-desktop.yml: package dry run
- release-dry-run.yml: dry run releases
- native-engine.yml: native sidecar build smoke

## Gates before merge

- package scripts check
- verify project structure
- contract validation
- frontend tests
- Rust tests
- native smoke tests when native files change
- docs updated when architecture changes

## Gates before release candidate

- all merge gates
- OS QA matrix filled
- signing secrets check
- threat model delta review
- release notes
- known issues doc
