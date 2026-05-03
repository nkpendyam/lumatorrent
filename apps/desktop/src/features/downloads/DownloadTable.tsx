import type { TorrentSummary } from "@lumatorrent/shared";
import { Badge } from "@lumatorrent/ui";
import { formatBytes, formatSpeed } from "../../lib/format";
import { healthCopy, statusCopy } from "./dashboardModel";

export function DownloadTable({
  torrents,
  onSelect,
}: {
  torrents: TorrentSummary[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--lt-surface-muted)] text-xs uppercase tracking-wide text-[var(--lt-text-tertiary)]">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3">Speed</th>
            <th className="px-4 py-3">Health</th>
            <th className="px-4 py-3">Size</th>
          </tr>
        </thead>
        <tbody>
          {torrents.map((torrent) => (
            <tr
              key={torrent.id}
              className="border-t border-[var(--lt-border-subtle)] hover:bg-[var(--lt-surface-muted)]"
            >
              <td className="px-4 py-3">
                <button
                  className="lt-focus-ring text-left font-medium text-[var(--lt-text-primary)] hover:underline"
                  onClick={() => onSelect(torrent.id)}
                >
                  {torrent.name}
                </button>
                <div className="text-xs text-[var(--lt-text-tertiary)]">{torrent.savePath}</div>
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusCopy[torrent.status].tone}>
                  {statusCopy[torrent.status].label}
                </Badge>
              </td>
              <td className="px-4 py-3">{Math.round(torrent.progress * 100)}%</td>
              <td className="px-4 py-3">
                {torrent.status === "seeding"
                  ? `${formatBytes(torrent.uploadSpeedBytes)}/s ↑`
                  : formatSpeed(torrent.downloadSpeedBytes)}
              </td>
              <td className="px-4 py-3">
                <Badge tone={healthCopy[torrent.health].tone}>
                  {healthCopy[torrent.health].label}
                </Badge>
              </td>
              <td className="px-4 py-3">{formatBytes(torrent.sizeBytes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
