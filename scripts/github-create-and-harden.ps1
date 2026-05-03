param(
  [Parameter(Mandatory=$true)][string]$Owner,
  [string]$Repo = "lumatorrent",
  [string]$Visibility = "public"
)
pnpm github:doctor
pnpm github:init -- --owner $Owner --repo $Repo --visibility $Visibility --execute
pnpm github:labels -- --owner $Owner --repo $Repo --execute
pnpm github:milestones -- --owner $Owner --repo $Repo --execute
pnpm github:issues -- --owner $Owner --repo $Repo --execute
pnpm github:rules -- --owner $Owner --repo $Repo --execute
pnpm github:secrets:check
