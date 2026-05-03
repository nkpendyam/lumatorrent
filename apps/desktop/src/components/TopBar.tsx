import { Command, LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@lumatorrent/ui";
import type { ViewDensity } from "../app/productState";

export function TopBar({
  title,
  subtitle,
  density,
  onToggleDensity,
  onCommand,
  onAdd,
}: {
  title: string;
  subtitle: string;
  density: ViewDensity;
  onToggleDensity: () => void;
  onCommand: () => void;
  onAdd: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--lt-border-subtle)] bg-[var(--lt-surface-overlay)] px-8 py-5 backdrop-blur-xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--lt-text-primary)]">
          {title}
        </h1>
        <p className="text-sm text-[var(--lt-text-secondary)]">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onToggleDensity}>
          {density === "cards" ? (
            <List size={16} aria-hidden />
          ) : (
            <LayoutGrid size={16} aria-hidden />
          )}
          <span className="ml-2">{density === "cards" ? "Table View" : "Card View"}</span>
        </Button>
        <Button onClick={onCommand}>
          <Command size={16} aria-hidden />
          <span className="ml-2">Command</span>
        </Button>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={16} aria-hidden />
          <span className="ml-2">Add Torrent</span>
        </Button>
      </div>
    </header>
  );
}
