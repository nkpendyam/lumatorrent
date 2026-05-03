$ErrorActionPreference = "Stop"
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { pnpm install }
pnpm lint
pnpm test
pnpm build
pnpm --filter @lumatorrent/desktop tauri build --debug
