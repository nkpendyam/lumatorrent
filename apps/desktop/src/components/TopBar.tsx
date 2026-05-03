import { Command, LayoutGrid, List, Menu, Monitor, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@lumatorrent/ui";
import type { ViewDensity } from "../app/productState";
import type { ResolvedTheme, ThemeMode } from "../app/theme";
import { getThemeControlLabel, getThemeModeLabel } from "../app/theme";

export function TopBar({
  title,
  subtitle,
  density,
  themeMode,
  resolvedTheme,
  onToggleDensity,
  onToggleSidebar,
  onToggleTheme,
  onCommand,
  onAdd,
}: {
  title: string;
  subtitle: string;
  density: ViewDensity;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onToggleDensity: () => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onCommand: () => void;
  onAdd: () => void;
}) {
  const ThemeIcon = themeMode === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--lt-border-subtle)] bg-[var(--lt-surface-overlay)] px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-10 px-0"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} aria-hidden />
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--lt-text-primary)]">
            {title}
          </h1>
          <p className="truncate text-sm text-[var(--lt-text-secondary)]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <Button onClick={onToggleDensity}>
          {density === "cards" ? (
            <List size={16} aria-hidden />
          ) : (
            <LayoutGrid size={16} aria-hidden />
          )}
          <span className="ml-2 hidden sm:inline">
            {density === "cards" ? "Table View" : "Card View"}
          </span>
        </Button>
        <Button onClick={onToggleTheme} aria-label={getThemeControlLabel(themeMode, resolvedTheme)}>
          <ThemeIcon size={16} aria-hidden />
          <span className="ml-2 hidden sm:inline">{getThemeModeLabel(themeMode)}</span>
        </Button>
        <Button onClick={onCommand}>
          <Command size={16} aria-hidden />
          <span className="ml-2 hidden sm:inline">Command</span>
        </Button>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={16} aria-hidden />
          <span className="ml-2 hidden sm:inline">Add Torrent</span>
        </Button>
      </div>
    </header>
  );
}
