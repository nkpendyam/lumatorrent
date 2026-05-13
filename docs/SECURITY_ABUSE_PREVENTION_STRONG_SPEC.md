# Security and Abuse Prevention Strong Spec

## Abuse boundaries

- no piracy search
- no scraping torrent indexes
- no default remote dashboard
- no malware execution helper
- no hidden proxy/VPN claims

## Required defenses

- path traversal prevention
- symlink deletion safety
- safe trash behavior
- risky executable warnings
- API localhost-only default
- auth token for engine API
- capability-minimized Tauri config
- dependency review

## Remote dashboard future gate

Remote access cannot ship until:

- authentication
- CSRF protection
- explicit enablement
- network binding warning
- rate limiting
- audit logging
- threat-model update
