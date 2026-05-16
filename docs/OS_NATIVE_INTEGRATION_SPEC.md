# OS Native Integration Spec

## Windows

- installer signing
- firewall prompt documentation
- recycle bin safe delete
- long path handling
- SmartScreen considerations

## macOS

- notarization
- hardened runtime
- app sandbox limitations
- trash safe delete
- Apple Silicon/Intel builds

## Linux

- AppImage/deb packaging
- desktop file
- xdg trash behavior
- Wayland/X11 tray differences

## Cross-platform rule

All destructive file operations must go through a platform abstraction with tests.
