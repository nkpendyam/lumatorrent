# Local Torrent Fixture Lab

## Goal

Test torrent behavior legally and repeatably.

## Fixture types

- small single-file torrent
- multi-file torrent
- many-small-files torrent
- unicode filename torrent
- dangerous filename simulation
- dead torrent simulation
- slow metadata simulation
- private torrent behavior fixture

## Safety

All fixtures must be generated locally or use legal/public-domain/open-source files.

## Automation plan

`pnpm fixtures:legal` creates placeholder fixture files and a manifest. Real torrent fixture generation may require an approved torrent creation tool installed by the developer.
