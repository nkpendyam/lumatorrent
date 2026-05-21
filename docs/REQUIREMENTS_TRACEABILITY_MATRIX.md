# Requirements Traceability Matrix

| Requirement                  | Source         | Implementation area      | Tests            | Status          |
| ---------------------------- | -------------- | ------------------------ | ---------------- | --------------- |
| Legal torrent downloads only | Product policy | UX copy, docs            | manual review    | foundation      |
| Add magnet link              | MVP            | engine client, add modal | contract/e2e     | not implemented |
| Add .torrent file            | MVP            | file import, engine API  | contract/e2e     | not implemented |
| Pause/resume/remove          | MVP            | engine API, UI actions   | unit/e2e         | mock only       |
| Premium dashboard            | UX             | frontend screens         | visual/e2e       | foundation      |
| Download Doctor              | Differentiator | diagnostics service      | unit/integration | foundation      |
| Safe delete                  | Safety         | engine file service      | unit/manual      | engine alpha    |
| Path traversal defense       | Security       | path sanitizer           | unit             | foundation      |
| Risky file warning           | Safety         | classifier               | unit             | foundation      |
| Engine sidecar               | Architecture   | native engine + Tauri    | integration      | foundation      |
| Multi-OS packaging           | Release        | workflows/scripts        | CI/manual        | planned         |
| Code signing                 | Release        | docs/secrets             | secrets check    | planned         |
| Accessibility                | UX             | components/tests         | axe/manual       | planned         |
| Performance budget           | Quality        | scripts/CI               | benchmark        | foundation      |
