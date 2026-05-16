# Download Doctor Algorithm Spec

## Purpose

Explain slow downloads without promising impossible speed.

## Inputs

- seeders
- peers
- availability
- tracker status
- DHT status
- port status
- upload/download moving averages
- active torrent count
- disk write latency
- VPN/proxy status if detectable

## Output

- cause list
- severity
- fixability
- confidence
- recommended actions
- technical details

## Confidence model

High confidence only when multiple signals agree.
Never say `this is definitely the cause` unless the signal is deterministic, such as disk full.
