# UI Components

Build shared components here only when they are reusable across features.

Expected v1 components:

- `Button`
- `Dialog`
- `ProgressBar`
- `HealthBadge`
- `CommandPalette`
- `SpeedGraph`
- `VirtualizedFileList`
- `ConfirmDangerousActionDialog`

Rules:

- Components must support keyboard navigation.
- Components must support reduced motion where animation is used.
- Components must not directly call the engine. Use feature-level containers.
