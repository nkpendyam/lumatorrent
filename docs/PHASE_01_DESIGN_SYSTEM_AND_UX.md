# Phase 01 — Design System and UX (Detailed)

## Objective

Create a premium, Apple-style, minimal, high-performance interface that feels calm, elegant, precise, and deeply usable.

## Design philosophy

This project should be inspired by Apple Human Interface Guidelines principles — especially clarity, deference, and depth — while remaining original and not copying Apple product screens or branding.

### Design north star

- Calm over loud.
- Content over chrome.
- Progressive disclosure over clutter.
- Motion for meaning, not spectacle.
- Native-feeling interactions on every platform.
- Accessibility built in from the start.

## Mandatory design inputs for Codex

Codex must read before implementing UI:

- `docs/DESIGN_RESEARCH_APPLE_2026.md`
- `docs/UX_DESIGN_SYSTEM.md`
- `docs/APPLE_STYLE_MOTION_GUIDELINES.md`
- `docs/CROSS_PLATFORM_DESIGN_ADAPTATION.md`
- `docs/UI_SCREEN_SPECIFICATIONS_2026.md`

## Deliverables in this phase

### 1) Product design brief

Define:

- audience
- use cases
- desired emotional tone
- visual keywords
- anti-patterns to avoid

### 2) Information architecture

Design:

- sidebar navigation
- top-level routes
- detail drill-down behavior
- expert-mode escape hatches
- search and command palette behavior

### 3) Design tokens

Create tokens for:

- spacing
- radii
- color scales
- typography scale
- shadows
- blurs
- stroke widths
- transitions
- z-index and layers

### 4) Core components

Design and document:

- buttons
- segmented controls
- cards
- list rows
- badges
- progress bars
- graphs
- dialogs
- toasts
- command palette
- sidebar
- tabs
- split panes
- inspector drawer

### 5) Screen flows

Must design:

- empty dashboard
- add torrent modal
- active download card dashboard
- inspector detail drawer
- settings experience
- download doctor
- completed downloads
- remove/delete confirmation
- error states
- first-run onboarding

### 6) Accessibility

Codex must design for:

- keyboard-first operation
- visible focus states
- screen readers
- color contrast
- reduce motion
- scalable text
- icon+text status indicators

### 7) Motion system

Codex must implement motion rules:

- 120–220ms for micro transitions
- 220–320ms for structural transitions
- avoid bounce-heavy motion
- animate state changes, not every data tick
- prefer opacity + transform over layout thrash

### 8) Design validation

Codex should use image generation and web-based design ideation tools to draft concepts, then translate them into reusable specs and components.

Approved inspiration workflow:

1. Generate screen concepts with image generation.
2. Compare against Apple-style principles.
3. Use tools like Stitch or 21st.dev for ideation/reference only.
4. Convert approved ideas into explicit tokens + component specs.
5. Never ship directly from generated mockups without engineering cleanup.

## Senior-engineer exit criteria

- Design tokens documented.
- Components documented.
- Screen specs documented.
- Accessibility checklist attached to each flow.
- Motion rules documented.
- Figma-equivalent spec quality achieved in markdown form.
