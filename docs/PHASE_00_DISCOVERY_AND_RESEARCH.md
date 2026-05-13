# Phase 00 — Discovery and Research

## Objective

Give Codex a complete understanding of the product, constraints, legal positioning, technical direction, and success metrics before writing production code.

## Desired outcomes

- A crisp product thesis.
- A prioritized feature matrix.
- A list of hard constraints and non-goals.
- A risk register.
- A repo plan and work breakdown.
- A design brief grounded in Apple-style minimalism without copying Apple assets.

## Workstreams

### 1) Competitor analysis

Codex should compare qBittorrent, Transmission, Deluge, BiglyBT, Tribler, and Tixati on:

- onboarding friction
- discoverability
- queue management
- diagnostics clarity
- system resource usage
- settings complexity
- error recovery
- delete/remove safety
- cross-platform polish

Deliverables:

- `docs/research/COMPETITOR_MATRIX.md`
- `docs/research/GAP_ANALYSIS.md`

### 2) Product definition

Create:

- core user personas
- primary user journeys
- jobs-to-be-done
- scope table: MVP / v1 / later
- differentiation thesis

Deliverables:

- update `docs/PRODUCT_REQUIREMENTS.md`
- create `docs/research/PERSONAS.md`
- create `docs/research/JOURNEYS.md`

### 3) Technical feasibility

Codex must validate:

- Tauri desktop shell viability
- sidecar process viability
- local engine API architecture
- data store approach
- platform packaging plan
- fixture strategy for legal torrent tests

Deliverables:

- update `docs/ARCHITECTURE.md`
- update `docs/ENGINE_INTEGRATION.md`
- update `docs/TESTING_STRATEGY.md`

### 4) Legal/safety framing

Codex must keep the project framed around legal torrent use only:

- Linux ISOs
- open-source releases
- public datasets
- Creative Commons content

Do not add built-in piracy-site search.
Do not add content-source scraping.
Do not market the product as an anonymity tool.

## Senior-engineer exit criteria for Phase 00

- Product scope reviewed and frozen for MVP.
- Risks and mitigations documented.
- Feature backlog prioritized.
- Technical architecture accepted.
- Design brief accepted.
- Codex task board generated.
