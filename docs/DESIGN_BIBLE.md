# LumaTorrent Design Bible

## Product feeling

LumaTorrent should feel like a calm, premium control center for decentralized legal downloads.

## Keywords

- minimal
- deliberate
- fast
- calm
- legible
- precise
- trustworthy
- native-feeling
- soft but not childish
- powerful but not noisy

## Anti-keywords

- cluttered
- tracker-table-first
- neon
- gamer UI
- glass everywhere
- fake Apple clone
- piracy-coded
- terminal-like for normal users

## Core design principles

### Clarity

Every state must be understandable without reading documentation.

Examples:

- "Finding metadata" instead of blank progress.
- "Waiting for seeders" instead of `0 B/s`.
- "Your port appears closed" instead of NAT jargon in primary UI.

### Deference

The UI should step back and let downloads be the content.

Examples:

- use neutral surfaces
- avoid excessive borders
- hide deep technical detail until user asks
- no ad-like panels

### Depth

Layering and motion should explain hierarchy.

Examples:

- dashboard card expands into inspector
- Add Torrent appears as focused modal
- Download Doctor appears as a structured diagnostic sheet

## Spatial system

- Base grid: 4px.
- Primary spacing: 8, 12, 16, 24, 32, 48.
- Cards: 16–24px radius.
- Dense rows: 10–12px vertical padding.
- Main dashboard gutters: 24–32px.

## Typography

- Use system UI stack.
- Use tabular numerals for speeds and ETA.
- Avoid more than 4 text sizes in a single surface.
- Prioritize readable stats over decorative headings.

Suggested scale:

- Display: 32/40
- Page title: 24/32
- Section title: 18/26
- Body: 14/22
- Secondary: 13/20
- Caption: 12/18

## Color

### Surface palette

Use neutral layered surfaces:

- app background
- sidebar surface
- card surface
- elevated modal surface
- overlay/backdrop

### Semantic palette

- success: completed/healthy
- info: active/in progress
- warning: weak availability/configuration issue
- critical: failed/dead/dangerous action

Do not rely on color alone.

## Iconography

- Use consistent stroke width.
- Pair critical icons with labels.
- Avoid decorative icons in data-heavy areas.
- Use SF Symbols-like conceptual consistency, but use open-source icons such as Lucide unless licensing/platform allows otherwise.

## Motion

- Meaningful, not flashy.
- Fast enough to feel responsive.
- Slow enough to preserve context.
- Obey Reduce Motion.

## Screen design rules

### Dashboard

Default to card view. Provide compact table view for experts.

### Add Torrent

Make the path from paste/drop to download obvious and reversible.

### Inspector

Use tabs for power without clutter.

### Download Doctor

Explain causes by severity and fixability.

### Settings

Searchable, categorized, progressive.

## Empty states

Every empty state needs:

- title
- one-sentence explanation
- primary action
- optional secondary help

## Error states

Every error needs:

- what happened
- why it might have happened
- what user can do
- technical detail hidden behind disclosure

## Accessibility acceptance criteria

- keyboard navigable
- visible focus states
- contrast checked
- Reduce Motion honored
- status text labels present
- screen-reader-friendly names
