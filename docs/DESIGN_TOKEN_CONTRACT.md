# Design Token Contract

## Token categories

- color.surface
- color.text
- color.semantic
- radius
- shadow
- spacing
- typography
- motion
- opacity
- zIndex

## Rules

- All UI colors must map to tokens.
- Semantic status must use token + text label.
- Motion durations must map to named tokens.
- Radii and spacing must use the scale.
- Do not hardcode one-off values in production components unless justified.

## Required token files

- `design/design-tokens.json`
- `apps/desktop/src/styles/tokens.css`
- `packages/ui/src/tokens.ts`
