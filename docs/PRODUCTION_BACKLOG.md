# Production Backlog

## P0: Foundation

- [ ] Build native-engine stub in CI on Windows/macOS/Linux
- [ ] Add local HTTP/IPC server with token auth
- [ ] Add generated TypeScript/Rust/C++ API schemas
- [ ] Add engine process supervisor in Tauri
- [ ] Add engine crash recovery UI state

## P1: libtorrent MVP

- [ ] Compile native-engine with libtorrent on one OS
- [ ] Add magnet link
- [ ] Add `.torrent` file
- [ ] List torrent status
- [ ] Pause/resume/remove
- [ ] Persist resume data
- [ ] Restore on app restart

## P2: Safety

- [ ] Path traversal rejection in native engine
- [ ] Risky file warning wired into add flow
- [ ] Delete-to-trash implementation per OS
- [ ] Remote API hardening tests
- [ ] Private torrent DHT/PEX correctness

## P3: Product differentiation

- [ ] Download Doctor v1
- [ ] Health score with confidence
- [ ] Smart queue mode
- [ ] Port checker
- [ ] Disk full detector
- [ ] VPN compatibility warning

## P4: Release

- [ ] Unsigned packages in CI
- [ ] macOS signing/notarization
- [ ] Windows signing
- [ ] Linux AppImage + deb
- [ ] Upgrade test automation
- [ ] Public beta release checklist
