import { useEffect, useMemo, useState } from "react";
import {
  isThemeMode,
  resolveThemeMode,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeMode,
} from "../app/theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : "system";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredTheme());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemTheme(query.matches ? "dark" : "light");

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const resolvedTheme = useMemo(() => resolveThemeMode(mode, systemTheme), [mode, systemTheme]);

  return { mode, resolvedTheme, setMode };
}
