import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { diagnoseTorrent, type SpeedDiagnostic, type TorrentSummary } from "@lumatorrent/shared";
import { DownloadCard } from "../features/downloads/DownloadCard";
import { DownloadTable } from "../features/downloads/DownloadTable";
import { DownloadInspector } from "../features/downloads/DownloadInspector";
import { AddTorrentModal } from "../features/add-torrent/AddTorrentModal";
import { DownloadDoctorPanel } from "../features/diagnostics/DownloadDoctorPanel";
import { createMockTorrent, tickTorrent } from "../features/downloads/mockEngine";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTheme } from "../hooks/useTheme";
import { CommandPalette } from "../components/CommandPalette";
import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { TopBar } from "../components/TopBar";
import { AppShell } from "./AppShell";
import { selectTorrent, type AppUiState } from "./productState";
import { SettingsPage } from "../features/settings/SettingsPage";
import { SafetyPage } from "../features/safety/SafetyPage";
import { DiagnosticsPage } from "../features/diagnostics/DiagnosticsPage";
import { getDownloadListMotion } from "./motion";
import { getNextThemeMode } from "./theme";

export function App() {
  const [torrents, setTorrents] = useState<TorrentSummary[]>([
    createMockTorrent("Ubuntu 26.04 Daily ISO", "excellent", 0.72),
    createMockTorrent("Public Climate Dataset", "good", 0.41),
    createMockTorrent("Creative Commons Film Pack", "weak", 0.08),
  ]);
  const [ui, setUi] = useState<AppUiState>({
    view: "downloads",
    density: "cards",
    selectedTorrentId: null,
    expertMode: false,
  });
  const [isAdding, setAdding] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<SpeedDiagnostic | null>(null);
  const reducedMotion = useReducedMotion();
  const { mode: themeMode, resolvedTheme, setMode: setThemeMode } = useTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTorrents((items) => items.map(tickTorrent)), 1200);
    return () => window.clearInterval(id);
  }, []);

  const selectedTorrent = useMemo(
    () => selectTorrent(torrents, ui.selectedTorrentId),
    [torrents, ui.selectedTorrentId],
  );
  const downloadListMotion = useMemo(() => getDownloadListMotion(reducedMotion), [reducedMotion]);
  const activeCount = torrents.filter((t) => t.status === "downloading").length;
  const totalSpeed = torrents.reduce((sum, torrent) => sum + torrent.downloadSpeedBytes, 0);

  return (
    <AppShell
      activeView={ui.view}
      resolvedTheme={resolvedTheme}
      sidebarCollapsed={sidebarCollapsed}
      onViewChange={(view) => setUi((current) => ({ ...current, view }))}
    >
      {ui.view === "downloads" ? (
        <>
          <TopBar
            title="Downloads"
            subtitle={`${activeCount} active · ${torrents.length} total`}
            density={ui.density}
            themeMode={themeMode}
            resolvedTheme={resolvedTheme}
            onToggleDensity={() =>
              setUi((current) => ({
                ...current,
                density: current.density === "cards" ? "table" : "cards",
              }))
            }
            onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
            onToggleTheme={() => setThemeMode((current) => getNextThemeMode(current))}
            onCommand={() => setCommandOpen(true)}
            onAdd={() => setAdding(true)}
          />
          <section className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {torrents.length === 0 ? (
              <EmptyState onAdd={() => setAdding(true)} />
            ) : (
              <>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <MetricCard
                    label="Total speed"
                    value={`${(totalSpeed / 1024 / 1024).toFixed(1)} MB/s`}
                    detail="smoothed mock telemetry"
                  />
                  <MetricCard label="Health" value="Mostly good" detail="availability weighted" />
                  <MetricCard
                    label="Protection"
                    value="Safe delete on"
                    detail="destructive actions guarded"
                  />
                </div>
                {ui.density === "cards" ? (
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {torrents.map((torrent) => (
                        <motion.div
                          key={torrent.id}
                          layout={downloadListMotion.layout}
                          initial={downloadListMotion.initial}
                          animate={downloadListMotion.animate}
                          exit={downloadListMotion.exit}
                          transition={downloadListMotion.transition}
                        >
                          <DownloadCard
                            torrent={torrent}
                            onDiagnose={() => setSelectedDiagnostic(diagnoseTorrent(torrent))}
                            onOpenDetails={() =>
                              setUi((current) => ({ ...current, selectedTorrentId: torrent.id }))
                            }
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <DownloadTable
                    torrents={torrents}
                    onSelect={(id) => setUi((current) => ({ ...current, selectedTorrentId: id }))}
                  />
                )}
              </>
            )}
          </section>
        </>
      ) : null}
      {ui.view === "diagnostics" ? <DiagnosticsPage /> : null}
      {ui.view === "safety" ? <SafetyPage /> : null}
      {ui.view === "settings" ? <SettingsPage /> : null}
      <AnimatePresence>
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
        {isAdding ? (
          <AddTorrentModal
            onClose={() => setAdding(false)}
            onAdd={(name) => {
              setTorrents((items) => [
                createMockTorrent(name || "New legal torrent", "checking", 0.0),
                ...items,
              ]);
              setAdding(false);
            }}
          />
        ) : null}
        {selectedDiagnostic ? (
          <DownloadDoctorPanel
            diagnostic={selectedDiagnostic}
            onClose={() => setSelectedDiagnostic(null)}
          />
        ) : null}
        {selectedTorrent ? (
          <DownloadInspector
            torrent={selectedTorrent}
            onClose={() => setUi((current) => ({ ...current, selectedTorrentId: null }))}
          />
        ) : null}
      </AnimatePresence>
    </AppShell>
  );
}
