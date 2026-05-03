# Lockfile Policy

This starter may not include a generated `pnpm-lock.yaml` because dependency resolution should happen on the developer or CI environment during bootstrap.

After first successful install, commit the generated lockfile:

```bash
pnpm install
pnpm test
pnpm build
git add pnpm-lock.yaml
git commit -m "chore: add dependency lockfile"
```

After that, CI should prefer:

```bash
pnpm install --frozen-lockfile
```
