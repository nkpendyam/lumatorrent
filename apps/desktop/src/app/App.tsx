import { AnimatePresence, motion } from "framer-motion";
import { Activity, Gauge, HeartPulse, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { diagnoseTorrent, type SpeedDiagnostic, type TorrentSummary } from "@lumatorrent/shared";
import { DownloadCard } from "../features/downloads/DownloadCard";
import { DownloadTable } from "../features/downloads/DownloadTable";
import { DownloadInspector } from "../features/downloads/DownloadInspector";
import { AddTorrentModal } from "../features/add-torrent/AddTorrentModal";
import { DownloadDoctorPanel } from "../features/diagnostics/DownloadDoctorPanel";
import {
  getEngineLifecycleNotice,
  initializeEngineLifecycle,
  isTickingMockClient,
  type EngineLifecycleState,
} from "../api/engineLifecycle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSettings } from "../hooks/useSettings";
import { useSystemTheme } from "../hooks/useTheme";
import { CommandPalette } from "../components/CommandPalette";
import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { TopBar } from "../components/TopBar";
import { AppShell } from "./AppShell";
import { getNextViewDensity, selectTorrent, type AppUiState } from "./productState";
import { SettingsPage } from "../features/settings/SettingsPage";
import { SafetyPage } from "../features/safety/SafetyPage";
import { DiagnosticsPage } from "../features/diagnostics/DiagnosticsPage";
import {
  dashboardFilters,
  filterTorrents,
  getDashboardStats,
  getEmptyStateCopy,
  type DashboardFilter,
} from "../features/downloads/dashboardModel";
import { getDownloadListMotion } from "./motion";
import { getNextThemeMode, resolveThemeMode } from "./theme";

export function App() {
  const [engineLifecycle, setEngineLifecycle] = useState<EngineLifecycleState | null>(null);
  const [torrents, setTorrents] = useState<TorrentSummary[]>([]);
  const [ui, setUi] = useState<AppUiState>({
    view: "downloads",
    density: "cards",
    selectedTorrentId: null,
    expertMode: false,
  });
  const [isAdding, setAdding] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<SpeedDiagnostic | null>(null);
  const { settings, updateSettings, resetSettings } = useSettings();
  const systemTheme = useSystemTheme();
  const reducedMotion = useReducedMotion(settings.appearance.reducedMotion);
  const resolvedTheme = resolveThemeMode(settings.appearance.theme, systemTheme);
  const engineNotice =
    engineLifecycle?.status === "unavailable" ? getEngineLifecycleNotice(engineLifecycle) : null;
  const engineStatusLabel =
    engineLifecycle?.status === "unavailable"
      ? null
      : engineLifecycle
        ? getEngineLifecycleNotice(engineLifecycle)
        : "Engine starting";

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
    let cancelled = false;
    void initializeEngineLifecycle().then((nextLifecycle) => {
      if (cancelled) return;
      setEngineLifecycle(nextLifecycle);
      void nextLifecycle.client.listTorrents().then(setTorrents);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!engineLifecycle) return undefined;
    const client = engineLifecycle.client;
    if (!isTickingMockClient(client)) return undefined;
    const id = window.setInterval(() => setTorrents(client.tick()), 1200);
    return () => window.clearInterval(id);
  }, [engineLifecycle]);

  const selectedTorrent = useMemo(
    () => selectTorrent(torrents, ui.selectedTorrentId),
    [torrents, ui.selectedTorrentId],
  );
  const visibleTorrents = useMemo(
    () => filterTorrents(torrents, dashboardFilter, searchQuery),
    [dashboardFilter, searchQuery, torrents],
  );
  const downloadListMotion = useMemo(() => getDownloadListMotion(reducedMotion), [reducedMotion]);
  const stats = useMemo(() => getDashboardStats(torrents), [torrents]);
  const emptyState = useMemo(
    () => getEmptyStateCopy(dashboardFilter, searchQuery),
    [dashboardFilter, searchQuery],
  );

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
            subtitle={`${stats.activeCount} active · ${torrents.length} total`}
            density={ui.density}
            themeMode={settings.appearance.theme}
            resolvedTheme={resolvedTheme}
            onToggleDensity={() =>
              setUi((current) => ({
                ...current,
                density: getNextViewDensity(current.density),
              }))
            }
            onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
            onToggleTheme={() =>
              updateSettings((current) => ({
                ...current,
                appearance: {
                  ...current.appearance,
                  theme: getNextThemeMode(current.appearance.theme),
                },
              }))
            }
            onCommand={() => setCommandOpen(true)}
            onAdd={() => setAdding(true)}
          />
          <section className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {engineStatusLabel ? (
              <div
                className="mb-4 rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] px-4 py-3 text-sm text-[var(--lt-text-secondary)]"
                role="status"
              >
                {engineStatusLabel}
              </div>
            ) : null}
            {engineNotice ? (
              <div
                className="mb-4 rounded-[var(--lt-radius-card)] border border-[var(--lt-status-warning-border)] bg-[var(--lt-status-warning-bg)] px-4 py-3 text-sm text-[var(--lt-status-warning-text)]"
                role="status"
              >
                <span>{engineNotice}</span>
                <button
                  type="button"
                  className="lt-focus-ring ml-3 rounded-[var(--lt-radius-control)] border border-current px-2 py-1 text-xs font-medium"
                  onClick={() => {
                    setEngineLifecycle(null);
                    setTorrents([]);
                    void initializeEngineLifecycle().then((nextLifecycle) => {
                      setEngineLifecycle(nextLifecycle);
                      void nextLifecycle.client.listTorrents().then(setTorrents);
                    });
                  }}
                >
                  Retry
                </button>
              </div>
            ) : null}
            {torrents.length === 0 ? (
              <EmptyState
                title={engineNotice ? "Engine unavailable" : undefined}
                description={
                  engineNotice ??
                  "Paste a magnet link or drop a .torrent file to begin. LumaTorrent is designed for legal files like Linux ISOs, open-source releases, public datasets, and Creative Commons media."
                }
                actionLabel={engineNotice ? "Engine offline" : "Add Torrent"}
                onAdd={() => {
                  if (!engineNotice) setAdding(true);
                }}
              />
            ) : (
              <>
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                  <MetricCard
                    label="Total speed"
                    value={`${(stats.totalSpeedBytes / 1024 / 1024).toFixed(1)} MB/s`}
                    detail="smoothed mock telemetry"
                    icon={<Gauge size={18} aria-hidden />}
                  />
                  <MetricCard
                    label="Health"
                    value={
                      stats.attentionCount > 0 ? `${stats.attentionCount} need review` : "Clear"
                    }
                    detail="availability weighted"
                    icon={<HeartPulse size={18} aria-hidden />}
                  />
                  <MetricCard
                    label="Completed"
                    value={`${stats.completedCount}`}
                    detail="ready or seeding"
                    icon={<Activity size={18} aria-hidden />}
                  />
                  <MetricCard
                    label="Protection"
                    value="Safe delete on"
                    detail="destructive actions guarded"
                    icon={<ShieldCheck size={18} aria-hidden />}
                  />
                </div>

                <div className="mb-5 flex flex-col gap-3 rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] p-3 shadow-[var(--lt-shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lt-text-tertiary)]"
                      size={16}
                      aria-hidden
                    />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="lt-focus-ring w-full rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-0)] py-2 pl-9 pr-3 text-sm text-[var(--lt-text-primary)] placeholder:text-[var(--lt-text-tertiary)]"
                      placeholder="Search legal downloads"
                      aria-label="Search downloads"
                    />
                  </div>
                  <div
                    className="flex gap-2 overflow-x-auto"
                    role="group"
                    aria-label="Dashboard filters"
                  >
                    {dashboardFilters.map((filter) => {
                      const selected = dashboardFilter === filter.id;

                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setDashboardFilter(filter.id)}
                          className={`lt-focus-ring shrink-0 rounded-[var(--lt-radius-pill)] px-3 py-2 text-sm font-medium transition duration-[var(--lt-duration-fast)] ease-[var(--lt-ease-standard)] ${
                            selected
                              ? "bg-[var(--lt-accent)] text-[var(--lt-text-inverse)]"
                              : "bg-[var(--lt-surface-muted)] text-[var(--lt-text-secondary)] hover:text-[var(--lt-text-primary)]"
                          }`}
                          aria-pressed={selected}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {ui.density === "cards" ? (
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {visibleTorrents.map((torrent) => (
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
                    {visibleTorrents.length === 0 ? (
                      <EmptyState
                        title={emptyState.title}
                        description={emptyState.description}
                        actionLabel="Clear filters"
                        onAdd={() => {
                          setDashboardFilter("all");
                          setSearchQuery("");
                        }}
                      />
                    ) : null}
                  </div>
                ) : (
                  <DownloadTable
                    torrents={visibleTorrents}
                    onSelect={(id) => setUi((current) => ({ ...current, selectedTorrentId: id }))}
                  />
                )}
                {ui.density === "table" && visibleTorrents.length === 0 ? (
                  <div className="mt-4">
                    <EmptyState
                      title={emptyState.title}
                      description={emptyState.description}
                      actionLabel="Clear filters"
                      onAdd={() => {
                        setDashboardFilter("all");
                        setSearchQuery("");
                      }}
                    />
                  </div>
                ) : null}
              </>
            )}
          </section>
        </>
      ) : null}
      {ui.view === "diagnostics" ? <DiagnosticsPage /> : null}
      {ui.view === "safety" ? <SafetyPage /> : null}
      {ui.view === "settings" ? (
        <SettingsPage
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetSettings={resetSettings}
        />
      ) : null}
      <AnimatePresence>
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
        {isAdding ? (
          <AddTorrentModal
            onClose={() => setAdding(false)}
            onAdd={(name) => {
              if (!engineLifecycle) return;
              const displayName = name || "New legal torrent";
              void engineLifecycle.client
                .addMagnet({
                  magnetUri: `magnet:?dn=${encodeURIComponent(displayName)}`,
                  savePath: "~/Downloads/LumaTorrent",
                })
                .then(() => engineLifecycle.client.listTorrents())
                .then(setTorrents)
                .catch(() => setTorrents([]));
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
