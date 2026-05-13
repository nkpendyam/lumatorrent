# Final Gap Register v14

| ID  | Gap                         | Severity | Why it remains                    | Owner     | Exit criteria                        |
| --- | --------------------------- | -------: | --------------------------------- | --------- | ------------------------------------ |
| G1  | Real libtorrent integration | Critical | Needs native coding and OS builds | Engine    | Legal torrent downloads successfully |
| G2  | Magnet metadata fetch       | Critical | Needs real engine networking      | Engine    | Metadata appears for legal magnet    |
| G3  | `.torrent` import           | Critical | Needs parsing and validation      | Engine/UI | File list shown and selectable       |
| G4  | Safe delete-to-trash        | Critical | OS-specific behavior              | Platform  | Delete tests pass on all OSes        |
| G5  | Download Doctor real data   |     High | Needs engine telemetry            | Engine/UI | Causes generated from real signals   |
| G6  | Signed installers           |     High | Needs private certs/secrets       | Release   | Signed artifacts produced in CI      |
| G7  | Real QA evidence            |     High | Needs actual machines             | QA        | OS QA matrix completed               |
| G8  | Beta feedback loop          |   Medium | Needs users                       | Product   | Issues triaged and fixed             |
