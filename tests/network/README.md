# Network Test Lab

This folder defines legal torrent/network QA scenarios. Do not add copyrighted test content.

## Fixtures

Use generated text/binary files only. Example:

```bash
./tests/network/generate-fixtures.sh
```

## Local torrent testing

A real local swarm test requires a torrent creation tool and the native libtorrent engine. Implement the harness after NATIVE-004.

Planned scripts:

- `generate-fixtures.sh`: creates legal files.
- `run-local-swarm.sh`: starts local seeder and LumaTorrent leecher.
- `kill-engine-recovery.sh`: verifies crash recovery.
