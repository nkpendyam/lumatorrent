# QA World-Class Test Matrix

## Platform matrix
- Windows 11 latest stable
- macOS latest stable Apple Silicon
- macOS latest stable Intel if available
- Ubuntu LTS
- Fedora latest optional

## Torrent behavior matrix
Use legal fixtures only.
- magnet healthy
- magnet metadata slow
- dead torrent
- private torrent
- many small files
- one huge file
- weird Unicode filenames
- risky executable names
- duplicate filenames
- disk full simulation
- network disconnect
- app crash during download
- engine crash during download

## UI matrix
- keyboard only
- screen reader smoke
- high contrast
- reduced motion
- compact window
- large monitor
- 125/150/200% scaling

## Release criteria
No public beta if:
- delete safety has unknown behavior
- engine crash loses downloads
- remote API binds publicly
- real engine can write outside allowed save path
- updater signature flow is not understood
