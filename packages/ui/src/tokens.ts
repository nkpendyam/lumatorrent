export const tokens = {
  color: {
    surface: {
      canvas: "var(--lt-surface-0)",
      base: "var(--lt-surface-1)",
      raised: "var(--lt-surface-2)",
      muted: "var(--lt-surface-muted)",
      border: "var(--lt-border-subtle)",
    },
    text: {
      primary: "var(--lt-text-primary)",
      secondary: "var(--lt-text-secondary)",
      tertiary: "var(--lt-text-tertiary)",
      inverse: "var(--lt-text-inverse)",
    },
    accent: {
      base: "var(--lt-accent)",
      strong: "var(--lt-accent-strong)",
      soft: "var(--lt-accent-soft)",
    },
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, "3xl": 48 },
  radius: { xs: 8, sm: 10, md: 14, lg: 18, xl: 24, card: 28, pill: 999 },
  typography: {
    caption: { size: "var(--lt-type-caption)", lineHeight: "var(--lt-leading-caption)" },
    body: { size: "var(--lt-type-body)", lineHeight: "var(--lt-leading-body)" },
    title: { size: "var(--lt-type-title)", lineHeight: "var(--lt-leading-title)" },
  },
  motion: { fast: 120, normal: 220, slow: 320, ease: "var(--lt-ease-standard)" },
  shadow: { soft: "var(--lt-shadow-soft)", panel: "var(--lt-shadow-panel)" },
} as const;
