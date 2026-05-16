# Cross-Platform Design Adaptation

## Goal

Maintain one design language while respecting each OS.

## Shared principles

- Same product mental model.
- Same design tokens.
- Same terminology.
- Same component semantics.

## Windows

- Support standard title bar alternatives carefully.
- Ensure high-contrast compatibility.
- Use Windows file picker expectations.
- Test scaling at 125/150/200%.

## macOS

- Respect menu bar conventions.
- Use expected shortcut notation.
- Keep window chrome elegant and restrained.
- Test Apple Silicon and Intel packaging paths if relevant.

## Linux

- Plan for distro variance.
- Ensure fallback behaviors for differing desktop environments.
- Avoid assuming identical tray behavior.
- Prioritize AppImage + deb first.

## Do not do

- Force one platform's conventions onto all others.
- Create OS-hostile keyboard shortcuts.
- Over-customize basic platform interactions.
