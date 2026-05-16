# Port Checker and Network Diagnostics Spec

## Constraints

Port detection is probabilistic. Report `appears open` or `appears closed`, not absolute truth.

## Tests

- no network
- VPN enabled
- CGNAT likely
- firewall blocked
- UPnP/NAT-PMP unavailable
- UDP tracker blocked

## UX copy

Use plain language first. Put protocol details behind `Show technical details`.
