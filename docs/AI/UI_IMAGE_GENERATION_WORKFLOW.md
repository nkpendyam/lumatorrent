# AI UI Image Generation Workflow

## Purpose

Use image generation to raise the visual bar before implementation. The generated concepts are inspiration and design QA references only.

## Workflow

1. Generate concept images from `design/image-generation/PREMIUM_UI_PROMPTS.md`.
2. Save selected images outside git unless they are original, license-safe, and intentionally committed.
3. Extract reusable design decisions into text and tokens.
4. Update `design/design-tokens.json`.
5. Update `docs/UX_DESIGN_SYSTEM.md` and `docs/UX_SCREEN_SPECS.md`.
6. Implement components in `packages/ui` and screens in `apps/desktop`.
7. Run accessibility and performance checks.

## Design review checklist

- Does it look original, not copied?
- Does it avoid piracy-oriented content?
- Is the default view simple?
- Is expert power still accessible?
- Are slow-download diagnostics obvious?
- Are destructive actions safe?
- Is the visual hierarchy calm and readable?
- Would the UI still work at 60 FPS?
