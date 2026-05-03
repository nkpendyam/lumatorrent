# Final Test and Release Bible

## Test layers

1. Unit tests.
2. Contract tests.
3. Frontend component tests.
4. E2E smoke tests.
5. Native sidecar smoke tests.
6. Legal torrent fixture tests.
7. OS-specific QA.
8. Release candidate tests.

## Must-test cases

- magnet metadata slow
- dead torrent
- no seeders
- tracker timeout
- DHT disabled
- port closed
- disk full
- invalid filename
- path traversal
- duplicate torrent
- app crash during download
- engine crash
- OS sleep/wake
- VPN on/off
- delete files to trash
- remove from app only

## Release gates

- `pnpm verify`
- `cargo test --workspace`
- contract validation
- performance budget check
- accessibility pass
- OS QA pass
- release notes
- known issues
- rollback plan
