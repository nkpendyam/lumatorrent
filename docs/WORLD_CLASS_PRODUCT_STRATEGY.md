# World-Class Product Strategy

## Product ambition
LumaTorrent should become the most understandable, safest, and most polished open-source torrent client for legal file distribution.

## Winning thesis
Existing clients usually force people to choose between power and polish. LumaTorrent must combine:
- qBittorrent-level capability
- Transmission-level calmness
- modern diagnostics clarity
- premium Apple-inspired interaction quality
- rigorous security and file-safety boundaries

## What "world-class" means here
World-class does not mean adding every feature first. It means every shipped feature is:
- useful
- fast
- safe
- accessible
- understandable
- tested
- recoverable after failure
- observable without violating privacy

## Competitive pillars
1. **Download Doctor**: explain slow downloads and separate fixable issues from torrent-health limitations.
2. **Safe file handling**: path traversal defense, risky-file warnings, safe delete-to-trash, no silent deletion.
3. **Premium minimal UI**: calm dashboard, smooth inspector, clean settings, expert mode only when requested.
4. **Engine crash isolation**: local sidecar boundary, restart recovery, durable resume state.
5. **Cross-platform release quality**: Windows/macOS/Linux packaging, signed release plan, clear QA matrix.

## Non-negotiables
- No built-in piracy index/search.
- No permission bypassing.
- No hidden telemetry.
- No remote dashboard exposed by default.
- No destructive file operations without explicit confirmation.
- No pretending dead torrents can be made fast.

## Success metrics
### UX
- First legal torrent added in under 30 seconds by a new user.
- User can explain why a slow torrent is slow after reading Download Doctor.
- All primary actions accessible by keyboard.

### Performance
- Dashboard remains responsive with 500 mock torrents.
- Status update cadence does not re-render every row unnecessarily.
- App startup stays inside defined budgets.

### Safety
- 100% path safety test pass rate.
- No parent-folder deletion by default.
- Remote API localhost-only by default.

### Release
- CI green across frontend, Rust, native stub, contracts, and package dry-run before beta.
