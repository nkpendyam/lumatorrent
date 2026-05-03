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
