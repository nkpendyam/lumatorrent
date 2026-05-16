# Supply Chain Security Plan

## Dependency rules

- prefer official package managers
- no arbitrary curl | bash
- lockfiles must be committed after dependency install
- review native dependencies carefully
- verify licenses

## Release rules

- signed artifacts where possible
- checksums generated
- provenance/SBOM planned before public release
- GitHub secrets never stored in repo
