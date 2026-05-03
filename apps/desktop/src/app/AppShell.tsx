import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import type { AppView } from "./productState";

export function AppShell({
  activeView,
  onViewChange,
  children,
}: {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-[var(--lt-surface-0)] text-[var(--lt-text-primary)]">
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      <main className="flex min-w-0 flex-1 flex-col" id="main-content">
        {children}
      </main>
    </div>
  );
}
