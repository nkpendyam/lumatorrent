# High-Efficiency Codex Prompt Pack

## 1. Repo scan prompt

Use the cheapest capable model.

Scan only the files relevant to this task. Do not inspect generated folders. Return:

- relevant files
- likely edit points
- risks
- targeted tests to run

Do not edit files yet.

## 2. Implementation prompt

Use the strongest model only if the task is complex.

Implement the smallest safe change. Respect:

- path safety
- localhost-only API rules
- feature flags
- test-first behavior
- no unrelated reformatting

After editing, run targeted tests and update docs if behavior changed.

## 3. Debug prompt

Use the strong model.

Investigate the failing test/build. Do not rewrite unrelated systems. Find root cause, patch minimally, add regression coverage, then rerun the failing command.

## 4. UI/UX prompt

Use image generation only for design exploration or visual reference, not for shipping code directly.

Create a premium, minimal, Apple-style UI that follows `docs/UX_DESIGN_SYSTEM.md`, `docs/UX_SCREEN_SPECS.md`, and `docs/ANIMATION_GUIDELINES.md`.

Output:

- layout proposal
- component changes
- motion details
- accessibility notes
- implementation checklist

## 5. Review prompt

Use the strong model.

Review the diff as a senior engineer. Look for security, data loss, platform, performance, UI, accessibility, and test coverage issues. Do not edit files during review.
