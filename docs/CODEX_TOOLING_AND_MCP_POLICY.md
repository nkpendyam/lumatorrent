# Codex Tooling and MCP Policy

Use tools only when they improve quality or speed.

## Approved tool categories

### GitHub

Use for:

- issue creation
- PR review
- labels
- release notes
- workflow checks

Do not use for:

- exposing secrets
- force-pushing protected branches
- deleting releases without explicit user approval

### Browser or visual review

Use for:

- checking UI screenshots
- comparing layout against design specs
- accessibility review

### Package/documentation lookup

Use only official sources for:

- Tauri
- React
- Rust
- libtorrent
- Playwright
- GitHub Actions
- OS packaging

### Filesystem

Use for local repo operations only.

## MCP registration rule

Every MCP/tool integration must be recorded with:

- name
- purpose
- permissions
- data it can access
- risks
- owner
- removal plan

Store this in `docs/SKILLS.md` or a dedicated ADR.

## Security baseline

- No secrets in prompts.
- No secrets in repo files.
- No unreviewed network automation.
- No remote dashboard exposure without auth.

## GitHub hygiene baseline

Keep GitHub focused on source, contracts, tests, product documentation, CI, and required product assets. Local dependency folders, build outputs, caches, reports, generated Tauri folders, and real environment files must stay ignored.

Before deleting tracked files, verify all of the following:

- `rg` finds no active references from code, scripts, docs, CI, manifests, or tests.
- the file is not a source file, lockfile, workflow, security policy, contract, fixture, app icon, design token, or current milestone document.
- the removal does not break `pnpm verify`.

Session cleanup status should record:

- current branch and `git status --short --branch`
- tracked file count
- untracked non-ignored files
- largest tracked files when repo size is a concern
- secret-pattern scan result after config, docs, scripts, or workflow changes

Use `pnpm repo:hygiene` at the start and end of cleanup sessions to print these checks consistently.

For Markdown cleanup, use `pnpm docs:hygiene` and `docs/DOCS_INDEX.md` before proposing deletions.
