import { FolderOpen, Pause, Search, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { TorrentSummary } from "@lumatorrent/shared";
import { formatBytes, formatEta } from "../../lib/format";

export function DownloadCard({
  torrent,
  onDiagnose,
  onOpenDetails,
}: {
  torrent: TorrentSummary;
  onDiagnose: () => void;
  onOpenDetails?: () => void;
}) {
  return (
    <article className="group rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] p-5 shadow-[var(--lt-shadow-soft)] backdrop-blur-xl transition duration-[var(--lt-duration-fast)] ease-[var(--lt-ease-standard)] hover:border-[var(--lt-border-strong)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--lt-radius-lg)] bg-[var(--lt-accent-soft)]">
              <ShieldCheck className="text-[var(--lt-accent-strong)]" size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-[var(--lt-text-primary)]">
                {torrent.name}
              </h2>
              <p className="text-sm text-[var(--lt-text-secondary)]">
                {Math.round(torrent.progress * 100)}% complete ·{" "}
                {formatBytes(torrent.downloadSpeedBytes)}/s ↓ · {formatEta(torrent.etaSeconds)}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-[var(--lt-radius-pill)] bg-[var(--lt-surface-muted)]">
            <div
              className="h-full rounded-[var(--lt-radius-pill)] bg-[var(--lt-accent)] transition-all duration-[700ms] ease-out"
              style={{ width: `${Math.round(torrent.progress * 100)}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--lt-text-secondary)]">
            <HealthBadge health={torrent.health} />
            <span>{torrent.seeders} seeders</span>
            <span>{torrent.peers} peers</span>
            <span>{formatBytes(torrent.uploadSpeedBytes)}/s ↑</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 opacity-90 transition group-hover:opacity-100">
          <Action icon={<Pause size={16} />} label="Pause" />
          <Action icon={<FolderOpen size={16} />} label="Reveal" />
          <button
            onClick={onDiagnose}
            className="lt-focus-ring flex items-center gap-2 rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-3 py-2 text-sm text-[var(--lt-text-primary)] hover:bg-[var(--lt-surface-muted)]"
          >
            <Search size={16} /> Diagnose
          </button>
          <button
            onClick={onOpenDetails}
            className="lt-focus-ring rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-3 py-2 text-sm text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

function Action({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="lt-focus-ring flex items-center gap-2 rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-3 py-2 text-sm text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]">
      {icon} {label}
    </button>
  );
}

function HealthBadge({ health }: { health: TorrentSummary["health"] }) {
  const label = health[0].toUpperCase() + health.slice(1);
  return (
    <span className="rounded-[var(--lt-radius-pill)] border border-[var(--lt-status-success-border)] bg-[var(--lt-status-success-bg)] px-3 py-1 text-xs font-medium text-[var(--lt-status-success-text)]">
      Health: {label}
    </span>
  );
}
