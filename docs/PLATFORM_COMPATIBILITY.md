# Platform Compatibility Plan

## Windows

Risks:

- Firewall prompts,
- Defender false positives,
- long paths,
- file locks,
- SmartScreen for unsigned builds.

Required tests:

- fresh install,
- pause/resume after restart,
- delete to Recycle Bin,
- blocked port diagnosis.

## macOS

Risks:

- notarization,
- Gatekeeper,
- app sandbox/file permissions,
- Intel vs Apple Silicon.

Required tests:

- app opens after download,
- selected folder permission persists,
- tray/menu behavior,
- signed release later.

## Linux

Risks:

- distro dependency variance,
- Wayland/X11 behavior,
- AppImage permissions,
- tray behavior.

Required tests:

- AppImage,
- deb package,
- Flatpak evaluation later.
