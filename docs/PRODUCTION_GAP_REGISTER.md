# Production Gap Register

This register tracks the difference between this scaffold and a shippable production torrent client.

| Gap | Severity | Owner | Exit criteria |
|---|---:|---|---|
| Real libtorrent add/magnet/download lifecycle | Critical | Engine | legal torrent can download, pause, resume, and seed |
| Real `.torrent` file parser path | Critical | Engine | `.torrent` import tested with fixture torrents |
| Safe delete-to-trash implementation | Critical | Desktop | files move to OS trash, never parent-delete |
| Engine crash recovery | High | Engine/Desktop | engine can restart and restore state |
| Installer builds | High | Release | unsigned dev installers generated in CI |
| Code signing | High | Release | secrets configured outside repo, signed release dry run passes |
| Windows firewall behavior | High | QA | documented and tested on Windows 11 |
| macOS notarization | High | Release | notarized build verified |
| Linux packaging | Medium | Release | AppImage/deb smoke tested |
| Accessibility automation | Medium | UI | axe/playwright checks in CI |
| Performance benchmark harness | Medium | Perf | scenario run generates report |
| Real Download Doctor diagnostics | High | Engine/UI | real port/tracker/DHT/seed diagnostics implemented |
