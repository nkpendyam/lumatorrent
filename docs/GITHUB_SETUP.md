# GitHub Setup

## Recommended branch rules

Protect `main`:

- Require pull request.
- Require CI passing.
- Require linear history.
- Require code owner review for security-sensitive files.

## Labels

- `area:ui`
- `area:engine`
- `area:security`
- `area:packaging`
- `area:diagnostics`
- `type:bug`
- `type:feature`
- `type:docs`
- `priority:critical`
- `good first issue`

## First issues

1. Build premium app shell.
2. Build download card.
3. Build add torrent modal.
4. Implement mock engine adapter.
5. Implement safe remove dialog.
6. Implement health score.
7. Implement Download Doctor mock diagnostics.
8. Add path safety tests.
9. Add Playwright smoke test.
10. Add Tauri sidecar prototype.

## Repository settings

- Enable Dependabot.
- Enable secret scanning.
- Enable code scanning if available.
- Add SECURITY.md.
- Add CODE_OF_CONDUCT.md.
- Add CONTRIBUTING.md.

## Automated repository creation

After authenticating GitHub CLI:

```bash
gh auth login
./scripts/init-github.sh
```

Windows:

```powershell
gh auth login
./scripts/init-github.ps1
```
