import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import type { AppView } from "./productState";
import type { ResolvedTheme } from "./theme";

export function AppShell({
  activeView,
  onViewChange,
  sidebarCollapsed,
  resolvedTheme,
  children,
}: {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  sidebarCollapsed: boolean;
  resolvedTheme: ResolvedTheme;
  children: ReactNode;
}) {
  return (
    <div
      className={`${resolvedTheme === "dark" ? "dark" : ""} flex h-screen w-screen bg-[var(--lt-surface-0)] text-[var(--lt-text-primary)]`}
      data-theme={resolvedTheme}
    >
      <Sidebar activeView={activeView} collapsed={sidebarCollapsed} onViewChange={onViewChange} />
      <main className="flex min-w-0 flex-1 flex-col" id="main-content">
        {children}
      </main>
    </div>
  );
}
