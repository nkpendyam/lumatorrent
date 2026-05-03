import { describe, expect, it } from "vitest";
import {
  LEGACY_THEME_STORAGE_KEY,
  SETTINGS_SCHEMA_VERSION,
  SETTINGS_STORAGE_KEY,
  cloneDefaultSettings,
  loadSettings,
  migrateSettings,
  parsePersistedSettings,
  resetSettings,
  saveSettings,
  type SettingsStorage,
} from "./settings";

function createMemoryStorage(
  seed: Record<string, string> = {},
): SettingsStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));

  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

describe("settings persistence", () => {
  it("returns safe default settings", () => {
    const settings = cloneDefaultSettings();

    expect(settings.schemaVersion).toBe(SETTINGS_SCHEMA_VERSION);
    expect(settings.appearance.theme).toBe("system");
    expect(settings.downloads.askBeforeDownloadLocation).toBe(true);
    expect(settings.smartModeEnabled).toBe(true);
    expect(settings.privacy.safetyWarningsEnabled).toBe(true);
  });

  it("loads valid persisted settings", () => {
    const storage = createMemoryStorage();
    const settings = cloneDefaultSettings();
    settings.appearance.theme = "dark";
    settings.expertMode = true;
    saveSettings(storage, settings);

    expect(loadSettings(storage).appearance.theme).toBe("dark");
    expect(loadSettings(storage).expertMode).toBe(true);
  });

  it("recovers from malformed persisted settings", () => {
    expect(parsePersistedSettings("{bad json").appearance.theme).toBe("system");
    expect(parsePersistedSettings(JSON.stringify(null)).smartModeEnabled).toBe(true);
  });

  it("migrates older settings to the current shape", () => {
    const migrated = migrateSettings({
      schemaVersion: 0,
      theme: "light",
      smartMode: false,
      expertMode: true,
    });

    expect(migrated.schemaVersion).toBe(SETTINGS_SCHEMA_VERSION);
    expect(migrated.appearance.theme).toBe("light");
    expect(migrated.smartModeEnabled).toBe(false);
    expect(migrated.expertMode).toBe(true);
    expect(migrated.downloads.activeDownloadLimit).toBe(3);
  });

  it("ignores unknown and unsafe fields", () => {
    const migrated = migrateSettings({
      schemaVersion: 1,
      appearance: { theme: "sepia", reducedMotion: "spin" },
      downloads: { defaultDirectory: "", activeDownloadLimit: 999, secretToken: "nope" },
      bandwidth: { downloadLimitBytesPerSecond: -1 },
      unknown: "ignored",
    });

    expect(migrated.appearance.theme).toBe("system");
    expect(migrated.appearance.reducedMotion).toBe("system");
    expect(migrated.downloads.defaultDirectory).toBe("~/Downloads/LumaTorrent");
    expect(migrated.downloads.activeDownloadLimit).toBe(3);
    expect(migrated.bandwidth.downloadLimitBytesPerSecond).toBeNull();
    expect("unknown" in migrated).toBe(false);
  });

  it("resets settings and removes legacy theme storage", () => {
    const storage = createMemoryStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({ schemaVersion: 1, expertMode: true }),
      [LEGACY_THEME_STORAGE_KEY]: "dark",
    });

    const reset = resetSettings(storage);

    expect(reset).toEqual(cloneDefaultSettings());
    expect(storage.getItem(LEGACY_THEME_STORAGE_KEY)).toBeNull();
    expect(JSON.parse(storage.getItem(SETTINGS_STORAGE_KEY) ?? "{}")).toEqual(
      cloneDefaultSettings(),
    );
  });

  it("keeps compatibility with the legacy theme key", () => {
    const storage = createMemoryStorage({ [LEGACY_THEME_STORAGE_KEY]: "dark" });

    expect(loadSettings(storage).appearance.theme).toBe("dark");
  });
});
