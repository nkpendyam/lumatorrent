# Dependency Policy

## Rules

- Prefer small, well-maintained dependencies.
- Avoid unmaintained packages for core flows.
- Avoid native dependencies in the UI layer unless necessary.
- Lock dependencies before public beta.
- Review licenses before every release.

## Current starter note

This starter does not include `pnpm-lock.yaml` because dependencies must be resolved on the target machine. After the first successful `pnpm install`, commit the generated lockfile.

Before public release, replace broad dependency ranges with reviewed versions and run:

```bash
pnpm audit
cargo audit
```

## Dependency review checklist

- [ ] License compatible with GPLv3 project.
- [ ] Maintained in the last 12 months.
- [ ] No unnecessary telemetry.
- [ ] No large transitive dependency tree unless justified.
- [ ] Security advisories reviewed.
