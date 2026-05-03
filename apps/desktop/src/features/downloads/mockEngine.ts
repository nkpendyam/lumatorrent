import type { TorrentHealth, TorrentStatus, TorrentSummary } from "@lumatorrent/shared";

type MockTorrentInput = {
  name: string;
  status: TorrentStatus;
  health: TorrentHealth;
  progress: number;
  downloadSpeedBytes?: number;
  uploadSpeedBytes?: number;
  etaSeconds?: number | null;
  seeders?: number;
  peers?: number;
  sizeBytes?: number;
};

export function createMockTorrent(
  name: string,
  health: TorrentHealth,
  progress: number,
  status: TorrentStatus = progress >= 1 ? "completed" : "downloading",
): TorrentSummary {
  return createMockTorrentFromInput({ name, status, health, progress });
}

export function createMockDashboardTorrents(): TorrentSummary[] {
  return [
    createMockTorrentFromInput({
      name: "Ubuntu 26.04 Daily ISO",
      status: "downloading",
      health: "excellent",
      progress: 0.72,
      downloadSpeedBytes: 8_400_000,
      uploadSpeedBytes: 420_000,
      seeders: 128,
      peers: 64,
    }),
    createMockTorrentFromInput({
      name: "Public Climate Dataset",
      status: "downloading",
      health: "good",
      progress: 0.41,
      downloadSpeedBytes: 2_100_000,
      uploadSpeedBytes: 210_000,
      seeders: 22,
      peers: 34,
    }),
    createMockTorrentFromInput({
      name: "Creative Commons Film Pack",
      status: "downloading",
      health: "weak",
      progress: 0.08,
      downloadSpeedBytes: 120_000,
      uploadSpeedBytes: 8_000,
      seeders: 2,
      peers: 4,
    }),
    createMockTorrentFromInput({
      name: "OpenStreetMap Regional Extract",
      status: "paused",
      health: "good",
      progress: 0.33,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      etaSeconds: null,
      seeders: 18,
      peers: 21,
    }),
    createMockTorrentFromInput({
      name: "LibreOffice Stable Release",
      status: "completed",
      health: "excellent",
      progress: 1,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      etaSeconds: 0,
      seeders: 96,
      peers: 12,
    }),
    createMockTorrentFromInput({
      name: "Fedora Workstation Legal Mirror",
      status: "seeding",
      health: "excellent",
      progress: 1,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 680_000,
      etaSeconds: 0,
      seeders: 74,
      peers: 42,
    }),
    createMockTorrentFromInput({
      name: "Public Domain Audiobook Archive",
      status: "metadata",
      health: "checking",
      progress: 0,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      etaSeconds: null,
      seeders: 0,
      peers: 3,
    }),
    createMockTorrentFromInput({
      name: "University Research Snapshot",
      status: "error",
      health: "dead",
      progress: 0.18,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      etaSeconds: null,
      seeders: 0,
      peers: 1,
    }),
  ];
}

function createMockTorrentFromInput(input: MockTorrentInput): TorrentSummary {
  const now = new Date().toISOString();
  const sizeBytes = input.sizeBytes ?? 5_700_000_000;
  const defaultSpeed =
    input.health === "weak" ? 120_000 : input.health === "excellent" ? 8_400_000 : 2_100_000;

  return {
    id: crypto.randomUUID(),
    name: input.name,
    status: input.status,
    progress: input.progress,
    downloadSpeedBytes:
      input.downloadSpeedBytes ?? (input.status === "downloading" ? defaultSpeed : 0),
    uploadSpeedBytes: input.uploadSpeedBytes ?? (input.health === "weak" ? 8_000 : 420_000),
    etaSeconds:
      input.etaSeconds === undefined
        ? input.progress >= 1
          ? 0
          : Math.round((1 - input.progress) * 1200)
        : input.etaSeconds,
    health: input.health,
    healthConfidence: input.health === "checking" ? 0.2 : 0.82,
    seeders:
      input.seeders ?? (input.health === "weak" ? 2 : input.health === "excellent" ? 128 : 22),
    peers: input.peers ?? (input.health === "weak" ? 4 : 64),
    sizeBytes,
    downloadedBytes: Math.round(input.progress * sizeBytes),
    uploadedBytes: 220_000_000,
    savePath: "~/Downloads/LumaTorrent",
    addedAtIso: now,
  };
}

export function tickTorrent(torrent: TorrentSummary): TorrentSummary {
  if (torrent.status !== "downloading") return torrent;
  const increment =
    torrent.health === "weak" ? 0.001 : torrent.health === "excellent" ? 0.01 : 0.004;
  const progress = Math.min(1, torrent.progress + increment * Math.random());
  return {
    ...torrent,
    progress,
    downloadedBytes: Math.round(progress * torrent.sizeBytes),
    etaSeconds: progress >= 1 ? 0 : Math.max(1, Math.round((1 - progress) * 1200)),
    status: progress >= 1 ? "completed" : torrent.status,
  };
}
