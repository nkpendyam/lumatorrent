import { useEffect, useState } from "react";
import {
  cloneDefaultSettings,
  loadSettings,
  resetSettings as resetPersistedSettings,
  saveSettings,
  type AppSettings,
} from "../app/settings";

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    if (typeof window === "undefined") return cloneDefaultSettings();
    return loadSettings(window.localStorage);
  });

  useEffect(() => {
    saveSettings(window.localStorage, settings);
  }, [settings]);

  function updateSettings(updater: (settings: AppSettings) => AppSettings) {
    setSettingsState((current) => saveSettings(window.localStorage, updater(current)));
  }

  function resetSettings() {
    setSettingsState(resetPersistedSettings(window.localStorage));
  }

  return { settings, updateSettings, resetSettings };
}
