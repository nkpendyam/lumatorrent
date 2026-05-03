# Platform Release Matrix

| Platform | Build | Package | Signing | Required QA |
|---|---|---|---|---|
| Windows x64 | required | MSI/EXE | required for public | Firewall prompt, SmartScreen, path length, antivirus false positive scan |
| Windows ARM64 | later | MSI/EXE | required for public | Native engine startup, install/uninstall |
| macOS Apple Silicon | required | DMG | Developer ID + notarization | Gatekeeper, permissions, app translocation, sleep/wake |
| macOS Intel | recommended | DMG | Developer ID + notarization | Same as above |
| Linux x64 | required | AppImage/deb | optional | Wayland/X11, tray, distro dependency check |
| Linux ARM64 | later | AppImage/deb | optional | Native engine build and package |

## Release gates

A release candidate cannot be published until:

- CI passes.
- Native-engine stub build passes on all target OSes.
- At least one native libtorrent build passes.
- Manual QA evidence is attached to the GitHub release issue.
