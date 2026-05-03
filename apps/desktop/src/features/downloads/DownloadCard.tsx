import { FolderOpen, Pause, Search, ShieldCheck } from "lucide-react";
import type { TorrentSummary } from "@lumatorrent/shared";
import { formatBytes, formatEta } from "../../lib/format";

export function DownloadCard({ torrent, onDiagnose, onOpenDetails }: { torrent: TorrentSummary; onDiagnose: () => void; onOpenDetails?: () => void }) {
  return (
    <article className="group rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-soft backdrop-blur-xl transition hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
              <ShieldCheck className="text-blue-300" size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight">{torrent.name}</h2>
              <p className="text-sm text-slate-400">
                {Math.round(torrent.progress * 100)}% complete · {formatBytes(torrent.downloadSpeedBytes)}/s ↓ · {formatEta(torrent.etaSeconds)}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-700 ease-out"
              style={{ width: `${Math.round(torrent.progress * 100)}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
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
            className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <Search size={16} /> Diagnose
          </button>
          <button
            onClick={onOpenDetails}
            className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
      {icon} {label}
    </button>
  );
}

function HealthBadge({ health }: { health: TorrentSummary["health"] }) {
  const label = health[0].toUpperCase() + health.slice(1);
  return (
    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
      Health: {label}
    </span>
  );
}
