# Senior Engineering Execution Standard

## Definition of strong

An area is considered **Strong** only when it has:

1. explicit architecture or design spec
2. implementation scaffold
3. test plan or automated test
4. owner-ready tasks
5. failure modes documented
6. release criteria

## Area score scale

- **Weak**: idea only
- **Light**: doc only
- **Medium**: doc + partial scaffold
- **Strong**: doc + scaffold + tests/scripts + backlog + risks
- **Production**: implemented, tested on real OS/network/user conditions

## v9 goal

Move every repo area to **Strong** as a scaffold. Do not falsely label unimplemented torrent behavior as production.

## Senior review checklist

Every PR must answer:

- What user problem does this solve?
- What failure mode did we test?
- What is the rollback path?
- What accessibility impact exists?
- What security boundary is affected?
- What performance budget does it touch?
- What docs were updated?
