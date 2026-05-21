# Phase Master Plan

## Purpose

This is the master execution map for contributors. It converts the project vision into a disciplined build plan that avoids speculative rewrites, protects safety, and moves from mock scaffold to a real cross-platform torrent client.

## Global engineering rule

Never implement a feature without:

1. a product reason,
2. a design state,
3. a data/API contract,
4. tests,
5. documented failure behavior,
6. security/safety review if it touches files, network, IPC, downloads, or permissions.

## Phase 0 — Discovery, research, constraints

### Goal

Understand the product deeply before coding.

### Required outputs

- competitor matrix
- product positioning
- user personas
- user journeys
- legal/safety boundaries
- risk register
- MVP scope freeze

### Contributor tasks

- Read the product, architecture, safety, and acceptance-gate docs.
- Fill `docs/research/COMPETITOR_MATRIX.md`.
- Fill `docs/research/GAP_ANALYSIS.md`.
- Fill `docs/research/PERSONAS.md`.
- Fill `docs/research/JOURNEYS.md`.
- Update `docs/PRODUCT_REQUIREMENTS.md`.

### Done when

The project can be described in one sentence, every MVP feature has a reason, and non-goals are explicit.

## Phase 1 — Design system and interaction model

### Goal

Create the Apple-inspired premium user experience before scaling implementation.

### Required outputs

- `docs/DESIGN_BIBLE.md` updated
- design tokens implemented
- component library spec written
- screen specs written
- accessibility notes added
- motion rules implemented

### Contributor tasks

- Create/refine design prompts.
- Generate/review concept directions with image generation.
- Translate concepts into tokens and components.
- Implement first dashboard screen.
- Implement Add Torrent modal states.
- Implement Download Doctor visual language.

### Done when

A user can understand the app in 10 seconds from the dashboard and advanced controls remain discoverable.

## Phase 2 — Frontend product shell

### Goal

Build a polished desktop shell with real state boundaries even while engine data is mocked.

### Required outputs

- app shell
- navigation
- cards/table toggle
- inspector drawer
- settings shell
- command palette
- empty/loading/error/success states
- Playwright smoke coverage

### Done when

The app feels like a real product demo and every major state is represented.

## Phase 3 — Engine API contract and mock engine

### Goal

Make the UI depend on a realistic engine contract, not hardcoded mock data.

### Required outputs

- versioned Engine API contract
- mock engine server
- contract tests
- event stream simulation
- error simulation
- state persistence simulation

### Done when

Frontend can switch between mock engine and future native engine with minimal changes.

## Phase 4 — Native engine sidecar

### Goal

Integrate native torrent capability safely behind a sidecar boundary.

### Required outputs

- sidecar build working in stub mode
- libtorrent build path documented
- lifecycle management
- engine crash recovery plan
- safe localhost binding
- auth token handshake
- feature flag for native mode

### Done when

The sidecar can start, respond to health checks, restart cleanly, and pass IPC safety tests.

## Phase 5 — Real torrent MVP

### Goal

Download legal torrents reliably.

### Required outputs

- magnet import
- `.torrent` import
- metadata fetching
- pause/resume/remove
- file selection
- progress/speed/ETA
- resume after restart
- safe delete-to-trash behavior
- legal fixture lab

### Done when

A legal Linux ISO torrent can download, pause, resume, survive restart, and be removed safely.

## Phase 6 — Download Doctor and smart diagnostics

### Goal

Make the product smarter than traditional clients.

### Required outputs

- health score model
- port check
- tracker status
- DHT status
- queue congestion detection
- disk free/slow detection
- VPN/proxy compatibility warning
- confidence labels

### Done when

Slow downloads get useful, honest explanations without promising impossible speed gains.

## Phase 7 — Expert mode

### Goal

Keep power users without overwhelming beginners.

### Required outputs

- tracker editor
- peer list
- ratio controls
- bandwidth profiles
- advanced network settings
- private torrent handling
- force recheck / force announce

### Done when

A power user can do expected advanced actions, but new users never see them by default.

## Phase 8 — QA, packaging, and release

### Goal

Make releases repeatable and trustworthy.

### Required outputs

- CI green
- multi-OS smoke tests
- packaging dry runs
- signing guide followed
- release checklist
- known issues
- update path tested

### Done when

A beta user can install the app on supported OSes and run basic flows without developer tools.

## Phase 9 — Beta operations

### Goal

Operate an open-source project professionally.

### Required outputs

- issue triage
- contribution guide
- security policy
- telemetry/crash-reporting decision
- privacy policy
- roadmap
- release cadence

### Done when

External contributors can help without creating chaos.
