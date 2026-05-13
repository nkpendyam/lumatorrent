# AI-Assisted Design Pipeline

## Objective

Use image generation and UI ideation tools to accelerate design without shipping unreviewed generated UI.

## Pipeline

1. Codex reads design docs.
2. Codex writes a design brief for one screen.
3. Generate concepts with image generation.
4. Use Stitch/21st.dev only for inspiration and component references.
5. Codex converts selected direction into tokens, layout specs, and React components.
6. Run accessibility and performance checks.
7. Senior review before merge.

## Anti-patterns

- copying Apple screens
- copying proprietary UI kits
- excessive glassmorphism
- inaccessible contrast
- motion without meaning
