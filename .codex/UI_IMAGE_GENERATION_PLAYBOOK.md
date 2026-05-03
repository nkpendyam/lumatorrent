# Premium UI/UX Image Generation Playbook

The app must look like a senior product team built it in 2026: calm, premium, minimal, high-performance, and not vibe-coded.

## Goal

Use OpenAI image generation to create UI/UX reference images before implementation. These images are for product direction and visual QA, not for copying proprietary Apple assets.

## Non-negotiable style direction

- Premium desktop app aesthetic
- Apple-level calmness, spacing, typography, and polish
- No Apple logos, macOS screenshots, or copied proprietary UI
- Original visual identity for LumaTorrent
- Minimal by default, powerful when expanded
- Smooth motion language: spring transitions, subtle hover states, calm progress updates
- Dense table mode available for experts, but not the default

## Required generated concept screens

Generate at least these UI concepts:

1. Empty dashboard
2. Active downloads dashboard
3. Add torrent modal
4. Download details side panel
5. Download Doctor diagnostics panel
6. Settings page
7. Expert mode table view
8. Risky file warning dialog
9. Remove/delete safety dialog
10. Dark mode dashboard
11. Compact laptop-size layout
12. Large monitor power-user layout

## Image prompt template

Use this template with the current best OpenAI image-generation tool available in your environment:

```text
Create a premium 2026 desktop app UI concept for an open-source legal torrent downloader called LumaTorrent. The design should feel Apple-quality but original, minimal, calm, and professional. No Apple logos and no copied macOS UI. Show [SCREEN_NAME]. Use large rounded cards, subtle depth, refined typography, elegant spacing, clean icons, soft dark/light surfaces, smooth progress visualization, and a clear hierarchy. The product is for legal downloads such as Linux ISOs, public datasets, open-source releases, and Creative Commons media. Include a smart diagnostics feature called Download Doctor. Make it look like a senior product design team built it, not a generic template.
```

Replace `[SCREEN_NAME]` with the screen being generated.

## UI extraction process

After generating concepts, Codex must not blindly copy pixels. Instead it must extract:

- Layout hierarchy
- Spacing system
- Component inventory
- Typography scale
- Color tokens
- Motion patterns
- Empty/error/loading states
- Accessibility concerns

Then update:

- `docs/UX_DESIGN_SYSTEM.md`
- `docs/UX_SCREEN_SPECS.md`
- `design/design-tokens.json`
- `design/ui-wireframes.md`
- `packages/ui/src/*`
- `apps/desktop/src/*`

## Implementation acceptance criteria

The UI implementation must pass these quality bars:

- 60 FPS target for normal interactions
- No excessive blur or heavy animation
- Respects reduced-motion preference
- Keyboard navigable
- Screen-reader labels for controls
- Works in narrow and wide desktop windows
- No cluttered technical data in default view
- Expert mode available for power users

## Forbidden

- Do not copy Apple icons, SF Symbols, or proprietary designs directly.
- Do not use piracy-related examples or torrent-site branding.
- Do not ship image-generated text as final UI copy without human review.
- Do not make the app look like a media piracy app.
