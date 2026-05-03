# Codex Prompt Pack Per Milestone

## M0 prompt
```
Audit the repo environment. Run preflight scripts. Fix only broken script references, missing files, and docs inconsistencies. Do not implement product features.
```

## M1 prompt
```
Implement the premium shell UI milestone. Read DESIGN_BIBLE, DESIGN_TOKEN_CONTRACT, UI_SCREEN_SPECIFICATIONS_2026, and FRONTEND_SCREEN_CONTRACTS. Build accessible shell screens and tests. Do not touch native engine code.
```

## M2 prompt
```
Implement a contract-complete mock engine. Validate contracts, create typed client, connect UI to mock data through the client only. Do not implement libtorrent yet.
```

## M5 prompt
```
Start libtorrent sidecar alpha. Read LIBTORRENT_REAL_IMPLEMENTATION_PLAYBOOK and ENGINE_CONTRACT_STRONG_SPEC. Implement the smallest native path that starts a session and emits health/status events. Avoid blocking UI-thread calls.
```

## M8 prompt
```
Harden packaging beta. Verify Tauri sidecar bundling, external binaries, capabilities, secrets checks, and CI dry runs. Do not add private keys.
```
