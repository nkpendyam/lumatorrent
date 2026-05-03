import { describe, expect, it } from "vitest";
import { getNextThemeMode, getThemeControlLabel, isThemeMode, resolveThemeMode } from "./theme";

describe("theme contract", () => {
  it("cycles through system, light, and dark", () => {
    expect(getNextThemeMode("system")).toBe("light");
    expect(getNextThemeMode("light")).toBe("dark");
    expect(getNextThemeMode("dark")).toBe("system");
  });

  it("resolves system mode from the current operating-system theme", () => {
    expect(resolveThemeMode("system", "dark")).toBe("dark");
    expect(resolveThemeMode("system", "light")).toBe("light");
    expect(resolveThemeMode("dark", "light")).toBe("dark");
  });

  it("rejects unknown persisted values", () => {
    expect(isThemeMode("system")).toBe(true);
    expect(isThemeMode("sepia")).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });

  it("labels the control with both selected and resolved theme", () => {
    expect(getThemeControlLabel("system", "dark")).toBe("Theme: System (dark)");
  });
});
