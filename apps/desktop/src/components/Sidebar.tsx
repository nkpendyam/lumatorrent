import { Activity, Download, Settings, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@lumatorrent/ui";
import type { AppView } from "../app/productState";

const navItems: Array<{ view: AppView; label: string; icon: ReactNode }> = [
  { view: "downloads", label: "Downloads", icon: <Download size={17} aria-hidden /> },
  { view: "diagnostics", label: "Diagnostics", icon: <Activity size={17} aria-hidden /> },
  { view: "safety", label: "Safety", icon: <ShieldCheck size={17} aria-hidden /> },
  { view: "settings", label: "Settings", icon: <Settings size={17} aria-hidden /> },
];

export function Sidebar({
  activeView,
  onViewChange,
}: {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--lt-border-subtle)] bg-[var(--lt-surface-overlay)] p-4 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[var(--lt-radius-lg)] bg-[var(--lt-accent-soft)] text-[var(--lt-accent-strong)] shadow-[var(--lt-shadow-soft)]">
          <Sparkles size={20} aria-hidden />
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight text-[var(--lt-text-primary)]">
            LumaTorrent
          </div>
          <div className="text-xs text-[var(--lt-text-tertiary)]">
            Legal downloads, beautifully.
          </div>
        </div>
      </div>

      <nav className="space-y-1 text-sm" aria-label="Primary">
        {navItems.map((item) => {
          const selected = activeView === item.view;

          return (
            <button
              key={item.view}
              type="button"
              aria-current={selected ? "page" : undefined}
              onClick={() => onViewChange(item.view)}
              className={`lt-focus-ring flex w-full items-center gap-3 rounded-[var(--lt-radius-control)] px-3 py-2.5 text-left transition duration-[var(--lt-duration-fast)] ease-[var(--lt-ease-standard)] ${
                selected
                  ? "bg-[var(--lt-surface-muted)] text-[var(--lt-text-primary)]"
                  : "text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Card className="mt-auto p-4 text-sm text-[var(--lt-text-secondary)]">
        <div className="font-medium text-[var(--lt-text-primary)]">Smart Mode is on</div>
        <p className="mt-1 text-xs leading-5 text-[var(--lt-text-tertiary)]">
          Luma explains slow downloads and suggests safe fixes instead of hiding protocol details.
        </p>
      </Card>
    </aside>
  );
}
