# Release Checklist

## Before release branch

- [ ] `pnpm verify` passes.
- [ ] `cargo test --workspace` passes.
- [ ] Manual QA plan completed on target OSes.
- [ ] Security-sensitive changes reviewed.
- [ ] Threat model updated if network/filesystem behavior changed.
- [ ] Changelog updated.
- [ ] Version bumped.

## Installer QA

- [ ] Fresh install works.
- [ ] Upgrade from previous version works.
- [ ] App can start without network.
- [ ] App resumes existing downloads after restart.
- [ ] Remove-only does not delete files.
- [ ] Delete-files flow previews exact files.
- [ ] App handles missing download folder.
- [ ] App handles disk full message.

## Platform checks

### Windows

- [ ] Installer opens.
- [ ] Firewall prompt does not confuse UX.
- [ ] Long path handling tested.
- [ ] SmartScreen expectations documented for unsigned dev builds.

### macOS

- [ ] Apple Silicon build tested.
- [ ] Intel build tested if supported.
- [ ] Gatekeeper/notarization status documented.
- [ ] Folder permissions tested.

### Linux

- [ ] AppImage tested.
- [ ] deb package tested if produced.
- [ ] Wayland/X11 basic behavior tested.

## After release

- [ ] GitHub release notes published.
- [ ] Checksums published.
- [ ] Known issues listed.
- [ ] Next milestone opened.
