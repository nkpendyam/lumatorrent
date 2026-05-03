import type { TorrentHealth, TorrentStatus, TorrentSummary } from "@lumatorrent/shared";

export type DashboardFilter =
  | "all"
  | "downloading"
  | "completed"
  | "seeding"
  | "paused"
  | "attention";

export const dashboardFilters: Array<{ id: DashboardFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "downloading", label: "Downloading" },
  { id: "completed", label: "Completed" },
  { id: "seeding", label: "Seeding" },
  { id: "paused", label: "Paused" },
  { id: "attention", label: "Attention needed" },
];

export const statusCopy: Record<
  TorrentStatus,
  { label: string; detail: string; tone: "neutral" | "success" | "warning" | "danger" | "info" }
> = {
  checking: {
    label: "Finding peers...",
    detail: "Looking for available peers before starting.",
    tone: "info",
  },
  metadata: {
    label: "Finding peers...",
    detail: "Fetching metadata and file details.",
    tone: "info",
  },
  downloading: {
    label: "Downloading",
    detail: "Downloading from available peers.",
    tone: "info",
  },
  paused: {
    label: "Paused",
    detail: "Paused by the user.",
    tone: "neutral",
  },
  completed: {
    label: "Download complete",
    detail: "Ready in the download folder.",
    tone: "success",
  },
  seeding: {
    label: "Seeding",
    detail: "Sharing completed legal files.",
    tone: "success",
  },
  error: {
    label: "Needs attention",
    detail: "Luma can help explain what happened.",
    tone: "danger",
  },
};

export const healthCopy: Record<
  TorrentHealth,
  { label: string; detail: string; tone: "neutral" | "success" | "warning" | "danger" | "info" }
> = {
  checking: {
    label: "Checking availability",
    detail: "Availability is still being measured.",
    tone: "info",
  },
  excellent: {
    label: "Excellent availability",
    detail: "Many seeders are available.",
    tone: "success",
  },
  good: {
    label: "Good availability",
    detail: "Enough peers are available.",
    tone: "success",
  },
  weak: {
    label: "Weak availability",
    detail: "Waiting for seeders.",
    tone: "warning",
  },
  dead: {
    label: "Waiting for seeders",
    detail: "No seeders are visible right now.",
    tone: "danger",
  },
};

export function matchesDashboardFilter(torrent: TorrentSummary, filter: DashboardFilter): boolean {
  if (filter === "all") return true;
  if (filter === "attention") {
    return torrent.status === "error" || torrent.health === "weak" || torrent.health === "dead";
  }
  return torrent.status === filter;
}

export function filterTorrents(
  torrents: TorrentSummary[],
  filter: DashboardFilter,
  searchQuery: string,
): TorrentSummary[] {
  const query = searchQuery.trim().toLowerCase();
  return torrents.filter((torrent) => {
    const matchesFilter = matchesDashboardFilter(torrent, filter);
    const matchesSearch =
      !query ||
      torrent.name.toLowerCase().includes(query) ||
      torrent.status.toLowerCase().includes(query) ||
      torrent.health.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });
}

export function getDashboardStats(torrents: TorrentSummary[]) {
  const activeCount = torrents.filter((torrent) => torrent.status === "downloading").length;
  const attentionCount = torrents.filter((torrent) =>
    matchesDashboardFilter(torrent, "attention"),
  ).length;
  const totalSpeedBytes = torrents.reduce((sum, torrent) => sum + torrent.downloadSpeedBytes, 0);
  const completedCount = torrents.filter(
    (torrent) => torrent.status === "completed" || torrent.status === "seeding",
  ).length;

  return { activeCount, attentionCount, totalSpeedBytes, completedCount };
}

export function getEmptyStateCopy(filter: DashboardFilter, searchQuery: string) {
  if (searchQuery.trim()) {
    return {
      title: "No downloads match that search",
      description:
        "Try a file name, status, or availability term. Nothing is wrong with your downloads.",
    };
  }

  if (filter === "all") {
    return {
      title: "No downloads yet",
      description:
        "Paste a magnet link or drop a .torrent file to begin. LumaTorrent is designed for legal files like Linux ISOs, open-source releases, public datasets, and Creative Commons media.",
    };
  }

  return {
    title: `No ${dashboardFilters.find((item) => item.id === filter)?.label.toLowerCase()} downloads`,
    description:
      "This filter has no matching items right now. Your other legal downloads remain available.",
  };
}
