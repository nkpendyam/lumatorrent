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
    <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onToggleDensity}>{density === "cards" ? "Table View" : "Card View"}</Button>
        <Button onClick={onCommand}>⌘K Command</Button>
        <Button variant="primary" onClick={onAdd}>+ Add Torrent</Button>
      </div>
    </header>
  );
}
