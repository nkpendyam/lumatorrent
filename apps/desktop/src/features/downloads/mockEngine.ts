import type { TorrentHealth, TorrentSummary } from "@lumatorrent/shared";

export function createMockTorrent(name: string, health: TorrentHealth, progress: number): TorrentSummary {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    status: progress >= 1 ? "completed" : "downloading",
    progress,
    downloadSpeedBytes: health === "weak" ? 120_000 : health === "excellent" ? 8_400_000 : 2_100_000,
    uploadSpeedBytes: health === "weak" ? 8_000 : 420_000,
    etaSeconds: progress >= 1 ? 0 : Math.round((1 - progress) * 1200),
    health,
    healthConfidence: health === "checking" ? 0.2 : 0.82,
    seeders: health === "weak" ? 2 : health === "excellent" ? 128 : 22,
    peers: health === "weak" ? 4 : 64,
    sizeBytes: 5_700_000_000,
    downloadedBytes: Math.round(progress * 5_700_000_000),
    uploadedBytes: 220_000_000,
    savePath: "~/Downloads/LumaTorrent",
    addedAtIso: now,
  };
}

export function tickTorrent(torrent: TorrentSummary): TorrentSummary {
  if (torrent.status !== "downloading") return torrent;
  const increment = torrent.health === "weak" ? 0.001 : torrent.health === "excellent" ? 0.01 : 0.004;
  const progress = Math.min(1, torrent.progress + increment * Math.random());
  return {
    ...torrent,
    progress,
    downloadedBytes: Math.round(progress * torrent.sizeBytes),
    etaSeconds: progress >= 1 ? 0 : Math.max(1, Math.round((1 - progress) * 1200)),
    status: progress >= 1 ? "completed" : torrent.status,
  };
}
