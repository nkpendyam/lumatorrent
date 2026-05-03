import type { ReactNode } from "react";
import { Card } from "@lumatorrent/ui";
import type { AppSettings, ReducedMotionPreference } from "../../app/settings";
import type { ThemeMode } from "../../app/theme";

const sections = [
  ["General", "Startup, tray behavior, default actions"],
  ["Downloads", "Save paths, file selection, queue defaults"],
  ["Speed", "Smart limits, scheduling, active torrent counts"],
  ["Network", "Port, DHT, PEX, proxy, encryption"],
  ["Privacy & Safety", "Risk warnings, safe delete, logs, crash reports"],
  ["Appearance", "Theme, density, reduce motion, accent"],
  ["Advanced", "Expert mode, engine logs, database repair"],
];

export function SettingsPage({
  settings,
  onUpdateSettings,
  onResetSettings,
}: {
  settings: AppSettings;
  onUpdateSettings: (updater: (settings: AppSettings) => AppSettings) => void;
  onResetSettings: () => void;
}) {
  return (
    <section className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-wide text-[var(--lt-accent-strong)]">
          Settings architecture
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--lt-text-primary)]">
          Simple first, expert when needed.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--lt-text-secondary)]">
          Settings are grouped by user intent. Advanced protocol controls stay available without
          overwhelming first-run users.
        </p>

        <Card className="mt-8 p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <SettingField label="Theme" description="Defaults to your system appearance.">
              <select
                value={settings.appearance.theme}
                onChange={(event) =>
                  onUpdateSettings((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      theme: event.target.value as ThemeMode,
                    },
                  }))
                }
                className="lt-focus-ring w-full rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-0)] px-3 py-2 text-sm text-[var(--lt-text-primary)]"
                aria-label="Theme preference"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </SettingField>

            <SettingField label="Motion" description="Respect system motion settings by default.">
              <select
                value={settings.appearance.reducedMotion}
                onChange={(event) =>
                  onUpdateSettings((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      reducedMotion: event.target.value as ReducedMotionPreference,
                    },
                  }))
                }
                className="lt-focus-ring w-full rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-0)] px-3 py-2 text-sm text-[var(--lt-text-primary)]"
                aria-label="Reduced motion preference"
              >
                <option value="system">System</option>
                <option value="reduce">Reduce motion</option>
                <option value="no-preference">Allow motion</option>
              </select>
            </SettingField>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <ToggleSetting
              label="Smart Mode"
              description="Keep plain-language diagnostics and safer defaults enabled."
              checked={settings.smartModeEnabled}
              onChange={(checked) =>
                onUpdateSettings((current) => ({ ...current, smartModeEnabled: checked }))
              }
            />
            <ToggleSetting
              label="Safety warnings"
              description="Warn before risky files or destructive actions."
              checked={settings.privacy.safetyWarningsEnabled}
              onChange={(checked) =>
                onUpdateSettings((current) => ({
                  ...current,
                  privacy: { ...current.privacy, safetyWarningsEnabled: checked },
                }))
              }
            />
            <ToggleSetting
              label="Expert mode"
              description="Show advanced protocol and repair controls later."
              checked={settings.expertMode}
              onChange={(checked) =>
                onUpdateSettings((current) => ({ ...current, expertMode: checked }))
              }
            />
          </div>

          <div className="mt-6 rounded-[var(--lt-radius-lg)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-muted)] p-4">
            <div className="text-sm font-medium text-[var(--lt-text-primary)]">
              Default download folder
            </div>
            <p className="mt-1 text-sm text-[var(--lt-text-secondary)]">
              {settings.downloads.defaultDirectory}
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--lt-text-tertiary)]">
              Folder permission selection will be wired in a later file-safety milestone. Luma asks
              before changing download locations by default.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onResetSettings}
              className="lt-focus-ring rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-4 py-2 text-sm font-medium text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]"
            >
              Reset settings
            </button>
          </div>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.map(([title, description]) => (
            <Card key={title} className="p-5">
              <h3 className="font-semibold text-[var(--lt-text-primary)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--lt-text-secondary)]">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SettingField({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--lt-text-primary)]">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-[var(--lt-text-tertiary)]">
        {description}
      </span>
      <span className="mt-3 block">{children}</span>
    </label>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-32 flex-col justify-between rounded-[var(--lt-radius-lg)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-muted)] p-4">
      <span>
        <span className="block text-sm font-medium text-[var(--lt-text-primary)]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[var(--lt-text-tertiary)]">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="lt-focus-ring mt-4 h-5 w-5 accent-[var(--lt-accent)]"
      />
    </label>
  );
}
