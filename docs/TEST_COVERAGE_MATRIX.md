# Test Coverage Matrix

## Unit tests

| Area          | Required coverage                                  |
| ------------- | -------------------------------------------------- |
| formatters    | bytes, speeds, ETA                                 |
| feature flags | defaults, overrides                                |
| safe paths    | traversal, absolute paths, unicode, reserved names |
| risky files   | executables, scripts, archives                     |
| health score  | low seeders, dead torrent, closed port             |
| API client    | success, auth failure, network failure             |
| safe delete   | nested files, duplicate targets, missing files     |
| add torrent   | visible risky-file warnings                        |
| remove dialog | remove-only default, explicit trash option         |

## Contract tests

| Contract      | Required coverage                       |
| ------------- | --------------------------------------- |
| engine health | OK, unavailable, version mismatch       |
| torrent list  | empty, active, errored                  |
| add torrent   | valid magnet, invalid magnet, duplicate |
| lifecycle     | pause, resume, remove                   |
| events        | progress, warning, error                |

## E2E tests

| Flow              | Required coverage      |
| ----------------- | ---------------------- |
| app loads         | dashboard visible      |
| add torrent modal | open/close, validation |
| mock download     | progress displayed     |
| diagnose          | panel visible          |
| settings          | route opens            |
| keyboard          | command palette opens  |
| remove            | confirmation appears   |

## Accessibility tests

- focus order
- keyboard navigation
- labels on icon buttons
- color contrast
- reduced motion

## Performance tests

- 100 mock torrents list rendering
- 1,000 file entries virtualized
- speed graph update throttling
- app boot budget

## Security tests

- localhost-only engine API
- auth token required
- path traversal rejected
- delete-to-trash only
- safe delete rejects symlink and directory manifest entries
- remote dashboard disabled by default
