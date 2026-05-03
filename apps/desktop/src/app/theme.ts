export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "lumatorrent.theme";

const themeModes: ThemeMode[] = ["system", "light", "dark"];

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && themeModes.includes(value as ThemeMode);
}

export function getNextThemeMode(mode: ThemeMode): ThemeMode {
  const index = themeModes.indexOf(mode);
  return themeModes[(index + 1) % themeModes.length] ?? "system";
}

export function resolveThemeMode(mode: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme {
  return mode === "system" ? systemTheme : mode;
}

export function getThemeModeLabel(mode: ThemeMode): string {
  if (mode === "system") return "System";
  return mode === "light" ? "Light" : "Dark";
}

export function getThemeControlLabel(mode: ThemeMode, resolvedTheme: ResolvedTheme): string {
  return `Theme: ${getThemeModeLabel(mode)} (${resolvedTheme})`;
}
