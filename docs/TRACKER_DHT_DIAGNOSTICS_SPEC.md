# Tracker and DHT Diagnostics Spec

## Tracker states
- working
- timeout
- DNS failed
- connection refused
- unsupported protocol
- private torrent tracker only

## DHT states
- disabled
- bootstrapping
- healthy
- low node count
- blocked

## Private torrent rule
If a torrent is private, DHT/PEX behavior must respect the private flag.
