# Security Model

## Threat model

Torrent metadata and downloaded filenames are untrusted. The app must defend against malicious paths, unsafe deletes, remote control exposure, and risky files.

## Safety principles

1. Never auto-open downloaded files.
2. Never silently delete files.
3. Never trust torrent paths.
4. Never expose remote API by default.
5. Never ship built-in piracy search.
6. Never hide dangerous file warnings for convenience.

## Path safety

Before creating files:

- Normalize path.
- Reject absolute paths from metadata.
- Reject `..` traversal.
- Reject empty segments.
- Handle Unicode normalization.
- Handle Windows reserved names.
- Enforce max path length policy.
- Prevent symlink escape.

## Deletion safety

Delete flow must ask:

1. Remove from app only.
2. Remove and move files to Trash.
3. Cancel.

Permanent delete is not allowed in MVP.

## Risky files

Warn for executable/script/archive types:

```text
.exe .msi .bat .cmd .ps1 .scr .vbs .js .jar .dmg .pkg .apk .sh .app
```

## Local API security

- Bind to 127.0.0.1 only.
- Use random session token.
- No remote dashboard in MVP.
- Future remote mode must require explicit enable + auth.

## Privacy

- No telemetry by default.
- No ads.
- No bundled software.
- Optional crash reports only after consent.
