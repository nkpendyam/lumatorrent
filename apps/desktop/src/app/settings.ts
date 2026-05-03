import { isThemeMode, type ThemeMode } from "./theme";

export const SETTINGS_SCHEMA_VERSION = 1;
export const SETTINGS_STORAGE_KEY = "lumatorrent.settings.v1";
export const LEGACY_THEME_STORAGE_KEY = "lumatorrent.theme";

export type ReducedMotionPreference = "system" | "reduce" | "no-preference";

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION;
  appearance: {
    theme: ThemeMode;
    reducedMotion: ReducedMotionPreference;
  };
  downloads: {
    defaultDirectory: string;
    askBeforeDownloadLocation: boolean;
    activeDownloadLimit: number;
  };
  smartModeEnabled: boolean;
  bandwidth: {
    downloadLimitBytesPerSecond: number | null;
    uploadLimitBytesPerSecond: number | null;
  };
  privacy: {
    safetyWarningsEnabled: boolean;
  };
  expertMode: boolean;
};

export type SettingsStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const defaultSettings: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  appearance: {
    theme: "system",
    reducedMotion: "system",
  },
  downloads: {
    defaultDirectory: "~/Downloads/LumaTorrent",
    askBeforeDownloadLocation: true,
    activeDownloadLimit: 3,
  },
  smartModeEnabled: true,
  bandwidth: {
    downloadLimitBytesPerSecond: null,
    uploadLimitBytesPerSecond: null,
  },
  privacy: {
    safetyWarningsEnabled: true,
  },
  expertMode: false,
};

export function cloneDefaultSettings(): AppSettings {
  return structuredClone(defaultSettings);
}

export function parsePersistedSettings(raw: string | null): AppSettings {
  if (!raw) return cloneDefaultSettings();

  try {
    return migrateSettings(JSON.parse(raw));
  } catch {
    return cloneDefaultSettings();
  }
}

export function migrateSettings(input: unknown): AppSettings {
  if (!isRecord(input)) return cloneDefaultSettings();

  const version = typeof input.schemaVersion === "number" ? input.schemaVersion : 0;

  if (version <= 0) {
    return normalizeSettings({
      ...cloneDefaultSettings(),
      appearance: {
        ...cloneDefaultSettings().appearance,
        theme: isThemeMode(input.theme) ? input.theme : readTheme(input.appearance),
      },
      smartModeEnabled: readBoolean(input.smartModeEnabled, readBoolean(input.smartMode, true)),
      expertMode: readBoolean(input.expertMode, false),
    });
  }

  return normalizeSettings(input);
}

export function normalizeSettings(input: unknown): AppSettings {
  const fallback = cloneDefaultSettings();
  if (!isRecord(input)) return fallback;

  const appearance = isRecord(input.appearance) ? input.appearance : {};
  const downloads = isRecord(input.downloads) ? input.downloads : {};
  const bandwidth = isRecord(input.bandwidth) ? input.bandwidth : {};
  const privacy = isRecord(input.privacy) ? input.privacy : {};

  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    appearance: {
      theme: readTheme(appearance, fallback.appearance.theme),
      reducedMotion: readReducedMotion(appearance.reducedMotion, fallback.appearance.reducedMotion),
    },
    downloads: {
      defaultDirectory: readSafeDirectory(
        downloads.defaultDirectory,
        fallback.downloads.defaultDirectory,
      ),
      askBeforeDownloadLocation: readBoolean(
        downloads.askBeforeDownloadLocation,
        fallback.downloads.askBeforeDownloadLocation,
      ),
      activeDownloadLimit: readIntegerInRange(
        downloads.activeDownloadLimit,
        fallback.downloads.activeDownloadLimit,
        1,
        20,
      ),
    },
    smartModeEnabled: readBoolean(input.smartModeEnabled, fallback.smartModeEnabled),
    bandwidth: {
      downloadLimitBytesPerSecond: readNullableLimit(bandwidth.downloadLimitBytesPerSecond),
      uploadLimitBytesPerSecond: readNullableLimit(bandwidth.uploadLimitBytesPerSecond),
    },
    privacy: {
      safetyWarningsEnabled: readBoolean(
        privacy.safetyWarningsEnabled,
        fallback.privacy.safetyWarningsEnabled,
      ),
    },
    expertMode: readBoolean(input.expertMode, fallback.expertMode),
  };
}

export function loadSettings(storage: SettingsStorage): AppSettings {
  const stored = storage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) return parsePersistedSettings(stored);

  const legacyTheme = storage.getItem(LEGACY_THEME_STORAGE_KEY);
  if (isThemeMode(legacyTheme)) {
    return normalizeSettings({
      ...cloneDefaultSettings(),
      appearance: { ...cloneDefaultSettings().appearance, theme: legacyTheme },
    });
  }

  return cloneDefaultSettings();
}

export function saveSettings(storage: SettingsStorage, settings: AppSettings): AppSettings {
  const normalized = normalizeSettings(settings);
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function resetSettings(storage: SettingsStorage): AppSettings {
  storage.removeItem(SETTINGS_STORAGE_KEY);
  storage.removeItem(LEGACY_THEME_STORAGE_KEY);
  const defaults = cloneDefaultSettings();
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

function readTheme(input: unknown, fallback: ThemeMode = "system"): ThemeMode {
  if (!isRecord(input)) return fallback;
  return isThemeMode(input.theme) ? input.theme : fallback;
}

function readReducedMotion(
  input: unknown,
  fallback: ReducedMotionPreference,
): ReducedMotionPreference {
  return input === "system" || input === "reduce" || input === "no-preference" ? input : fallback;
}

function readBoolean(input: unknown, fallback: boolean): boolean {
  return typeof input === "boolean" ? input : fallback;
}

function readIntegerInRange(input: unknown, fallback: number, min: number, max: number): number {
  if (typeof input !== "number" || !Number.isInteger(input)) return fallback;
  if (input < min || input > max) return fallback;
  return input;
}

function readNullableLimit(input: unknown): number | null {
  if (input === null || input === undefined) return null;
  if (
    typeof input !== "number" ||
    !Number.isInteger(input) ||
    input <= 0 ||
    input > 1_000_000_000
  ) {
    return null;
  }
  return input;
}

function readSafeDirectory(input: unknown, fallback: string): string {
  if (typeof input !== "string") return fallback;
  const trimmed = input.trim();
  if (!trimmed || trimmed.includes("\0")) return fallback;
  return trimmed.slice(0, 512);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
