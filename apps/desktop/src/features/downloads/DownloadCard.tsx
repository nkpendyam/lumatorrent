import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Pause,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import type { TorrentSummary } from "@lumatorrent/shared";
import { Badge } from "@lumatorrent/ui";
import { formatBytes, formatEta } from "../../lib/format";
import { healthCopy, statusCopy } from "./dashboardModel";

export function DownloadCard({
  torrent,
  onDiagnose,
  onOpenDetails,
}: {
  torrent: TorrentSummary;
  onDiagnose: () => void;
  onOpenDetails?: () => void;
}) {
  const status = statusCopy[torrent.status];
  const health = healthCopy[torrent.health];
  const progressPercent = Math.round(torrent.progress * 100);

  return (
    <article className="group rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] p-5 shadow-[var(--lt-shadow-soft)] backdrop-blur-xl transition duration-[var(--lt-duration-fast)] ease-[var(--lt-ease-standard)] hover:border-[var(--lt-border-strong)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--lt-radius-lg)] bg-[var(--lt-accent-soft)]">
              <StatusIcon status={torrent.status} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-[var(--lt-text-primary)]">
                {torrent.name}
              </h2>
              <p className="text-sm text-[var(--lt-text-secondary)]">
                {status.label} · {formatSpeedLine(torrent)}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-[var(--lt-radius-pill)] bg-[var(--lt-surface-muted)]">
            <div
              className="h-full rounded-[var(--lt-radius-pill)] bg-[var(--lt-accent)] transition-all duration-[700ms] ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-xs text-[var(--lt-text-tertiary)]">
            <span>{progressPercent}% complete</span>
            <span>
              {formatBytes(torrent.downloadedBytes)} of {formatBytes(torrent.sizeBytes)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--lt-text-secondary)]">
            <StatusBadge label={status.label} tone={status.tone} />
            <HealthBadge health={torrent.health} />
            <span>{torrent.seeders} seeders</span>
            <span>{torrent.peers} peers</span>
            <span>{formatBytes(torrent.uploadSpeedBytes)}/s ↑</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--lt-text-tertiary)]">
            {torrent.health === "weak" || torrent.health === "dead" ? health.detail : status.detail}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 opacity-90 transition group-hover:opacity-100">
          <Action
            icon={<Pause size={16} />}
            label={torrent.status === "paused" ? "Resume" : "Pause"}
          />
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

function formatSpeedLine(torrent: TorrentSummary) {
  if (torrent.status === "completed") return "Ready to open";
  if (torrent.status === "seeding") return `${formatBytes(torrent.uploadSpeedBytes)}/s ↑`;
  if (torrent.status === "paused") return "Paused";
  if (torrent.status === "metadata" || torrent.status === "checking") return "Finding peers...";
  if (torrent.status === "error") return "Needs attention";
  return `${formatBytes(torrent.downloadSpeedBytes)}/s ↓ · ${formatEta(torrent.etaSeconds)}`;
}

function StatusIcon({ status }: { status: TorrentSummary["status"] }) {
  if (status === "completed" || status === "seeding") {
    return <CheckCircle2 className="text-[var(--lt-status-success-text)]" size={22} aria-hidden />;
  }
  if (status === "error") {
    return <AlertTriangle className="text-[var(--lt-status-danger-text)]" size={22} aria-hidden />;
  }
  if (status === "metadata" || status === "checking" || status === "paused") {
    return <Clock3 className="text-[var(--lt-status-info-text)]" size={22} aria-hidden />;
  }
  return <ShieldCheck className="text-[var(--lt-accent-strong)]" size={22} aria-hidden />;
}

function Action({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="lt-focus-ring flex items-center gap-2 rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-3 py-2 text-sm text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]">
      {icon} {label}
    </button>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return <Badge tone={tone}>Status: {label}</Badge>;
}

function HealthBadge({ health }: { health: TorrentSummary["health"] }) {
  const copy = healthCopy[health];
  return <Badge tone={copy.tone}>Health: {copy.label}</Badge>;
}
