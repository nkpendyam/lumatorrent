# Apple-Style Design Research (2026)

## Purpose
This document translates Apple-inspired design principles into actionable rules for LumaTorrent.

## Sources to study
Primary official sources:
- Apple Human Interface Guidelines
- Apple typography guidance
- Apple color guidance
- Apple SF Symbols guidance
- Apple design resources
- Apple platform-specific design pages
- Apple design system video updates when relevant

Supplementary ideation sources:
- Google Stitch for early concept generation
- 21st.dev for component inspiration

## Core principles to apply
### 1) Clarity
Meaning:
- Legible text.
- Obvious actions.
- Simple hierarchy.
- Minimal ambiguity.

Apply to LumaTorrent:
- Important numbers must be readable at a glance.
- Status must always have a text label, not only a color.
- Every action should have a single obvious place.
- Error states should explain what happened and what to do next.

### 2) Deference
Meaning:
- UI should support the content, not dominate it.
- Chrome should recede.

Apply to LumaTorrent:
- Use quiet surfaces.
- Avoid heavy borders and excessive color.
- Let download status and file information be the visual focus.
- Hide expert controls until requested.

### 3) Depth
Meaning:
- Use layering and motion to show hierarchy and continuity.

Apply to LumaTorrent:
- Inspector panel slides in.
- Modals feel attached to the current context.
- Motion should explain transitions.
- Use shadow, blur, and elevation sparingly.

## Interaction guidance
- Hit targets must be generous.
- Navigation should feel predictable.
- Motion must be subtle and meaningful.
- Shortcuts should exist for repeat workflows.
- Feedback should be immediate.

## Visual foundations
### Typography
- Prefer system UI typography.
- Clear hierarchy with restrained scale.
- Avoid too many font weights.
- Use tabular numerals where speed/ETA alignment helps.

### Color
- Default surfaces are neutral.
- Accent color should be used for action and focus, not decoration.
- Semantic colors must map to system states: success, warning, critical, info.
- Dark mode must be first-class, not an afterthought.

### Iconography
- Prefer SF Symbols-like consistency.
- Use simple, readable icon forms.
- Do not overload icons with meaning; pair with text when important.

### Layout
- Strong whitespace.
- Fewer regions with clearer grouping.
- Stable alignment.
- Dense information only in expert areas.

## Motion guidance
- Motion should preserve context.
- Avoid constant motion on fast-changing telemetry.
- Progress changes should interpolate gently.
- Reduce Motion must disable nonessential transitions.

## What to avoid
- Faux-Apple cloning.
- Over-glassmorphism.
- Oversaturated dashboards.
- Data tables as the default main experience.
- Raw engineering jargon in primary UI.
- Huge settings dumps.

## Translation into product decisions
### Dashboard
Use cards by default, not raw tables.

### Details
Use a side inspector or focused detail surface.

### Diagnostics
Use human explanations first, technical details second.

### Settings
Use progressive disclosure with clear sections and search.

### Multi-platform adaptation
Respect platform conventions for menus, shortcuts, and file dialogs while maintaining a consistent design language.
