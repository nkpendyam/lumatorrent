import { Activity, Download, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@lumatorrent/ui";
import type { AppView } from "./productState";

const navItems: Array<{ view: AppView; label: string; icon: React.ReactNode }> = [
  { view: "downloads", label: "Downloads", icon: <Download size={17} /> },
  { view: "diagnostics", label: "Diagnostics", icon: <Activity size={17} /> },
  { view: "safety", label: "Safety", icon: <ShieldCheck size={17} /> },
  { view: "settings", label: "Settings", icon: <Settings size={17} /> },
];

export function AppShell({
  activeView,
  onViewChange,
  children,
}: {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex h-screen w-screen bg-[#090b10] text-slate-100">
      <aside className="flex w-64 flex-col border-r border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20 text-blue-300 shadow-soft">
            <Sparkles size={20} aria-hidden />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">LumaTorrent</div>
            <div className="text-xs text-slate-400">Legal downloads, beautifully.</div>
          </div>
        </div>
        <nav className="space-y-1 text-sm" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-400/70 ${
                activeView === item.view ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <Card className="mt-auto p-4 text-sm text-slate-300">
          <div className="font-medium text-white">Smart Mode is on</div>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Luma explains slow downloads and suggests safe fixes instead of hiding protocol details.
          </p>
        </Card>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
