import type { TorrentSummary } from "@lumatorrent/shared";
import { formatBytes, formatSpeed } from "../../lib/format";

export function DownloadTable({ torrents, onSelect }: { torrents: TorrentSummary[]; onSelect: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3">Speed</th>
            <th className="px-4 py-3">Health</th>
            <th className="px-4 py-3">Size</th>
          </tr>
        </thead>
        <tbody>
          {torrents.map((torrent) => (
            <tr key={torrent.id} className="border-t border-white/10 hover:bg-white/[0.04]">
              <td className="px-4 py-3">
                <button className="text-left font-medium text-white hover:underline" onClick={() => onSelect(torrent.id)}>{torrent.name}</button>
                <div className="text-xs text-slate-500">{torrent.status}</div>
              </td>
              <td className="px-4 py-3">{Math.round(torrent.progress * 100)}%</td>
              <td className="px-4 py-3">{formatSpeed(torrent.downloadSpeedBytes)}</td>
              <td className="px-4 py-3 capitalize">{torrent.health}</td>
              <td className="px-4 py-3">{formatBytes(torrent.sizeBytes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
