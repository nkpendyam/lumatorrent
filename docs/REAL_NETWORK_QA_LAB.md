# Real Network QA Lab

Use only legal/local torrents.

## Goals

Test real behavior without relying on piracy sites or uncontrolled public torrents.

## Test scenarios

1. Local healthy torrent
2. Local seeder disconnects mid-download
3. Magnet metadata delay
4. Closed port behavior
5. VPN/proxy warning behavior
6. Disk full behavior
7. Engine crash and recovery
8. App sleep/wake behavior
9. Many small files
10. Unicode and long filenames
11. Private torrent rules
12. Remove from app only
13. Remove and move files to trash

## Local swarm concept

- Generate a legal fixture directory.
- Create a `.torrent` file using a local tool.
- Start one local seed process.
- Start LumaTorrent as leecher.
- Validate progress, completion, and hash check.

## What cannot be fully automated in CI

- Router NAT/port forwarding behavior
- Real ISP throttling
- VPN provider behavior
- OS firewall UI prompts
- macOS Gatekeeper user experience

These require manual QA scripts and checklists.
