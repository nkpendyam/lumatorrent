# UI/UX Design System

## Design personality

Calm, premium, minimal, fast, safe, human.

Inspired by:

- Apple Finder simplicity.
- Arc Browser softness.
- Linear clarity.
- CleanMyMac diagnostics feel.

## Design rule

Simple by default. Powerful when expanded.

## Main layout

```text
Sidebar | Main Dashboard | Optional Details Drawer
```

## Screens

1. Empty dashboard.
2. Active downloads dashboard.
3. Add torrent modal.
4. Download details drawer.
5. Download Doctor panel.
6. Settings.
7. Safe remove dialog.
8. Risky file warning.
9. Compact table mode.
10. Expert mode.

## Component checklist

- App shell.
- Sidebar.
- Top bar.
- Download card.
- Health badge.
- Speed badge.
- Progress bar.
- Details drawer.
- Add torrent modal.
- Download Doctor panel.
- Speed chart.
- Toasts.
- Empty state.
- Confirmation dialog.
- Command palette.
- Settings panels.

## Motion rules

Use animations to clarify state, not decorate randomly.

Good:

- Card expands into details.
- Progress smoothly updates.
- Modal slides/fades.
- Completed state checkmark.
- Drag/drop glow.

Bad:

- Constant bouncing.
- Animated backgrounds.
- Heavy blur everywhere.
- Animating every speed tick.

## Accessibility

- Keyboard navigation.
- Visible focus states.
- Screen reader labels.
- Reduced motion support.
- Status is not color-only.
- Minimum readable text sizes.

## Copy rules

Bad:

```text
DHT bootstrap failed. UDP tracker timeout.
```

Good:

```text
We could not connect to enough peers yet. This may happen if the torrent has few seeders or your network blocks incoming connections.
```

Technical details can be under “Show technical details.”

## Health labels

- Excellent
- Good
- Weak
- Dead
- Checking

Each label should include reason and confidence.

## Slow speed UX

Do not show only `0 B/s`. Show context:

- Fetching metadata.
- Looking for seeders.
- Waiting for peers.
- Checking trackers.
- Weak availability.
- Port may be closed.
