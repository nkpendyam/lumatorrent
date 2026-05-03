import type { TorrentSummary } from "@lumatorrent/shared";

export type AppView = "downloads" | "diagnostics" | "safety" | "settings";
export type ViewDensity = "cards" | "table";

export type AppUiState = {
  view: AppView;
  density: ViewDensity;
  selectedTorrentId: string | null;
  expertMode: boolean;
};

export function selectTorrent(torrents: TorrentSummary[], id: string | null) {
  return torrents.find((torrent) => torrent.id === id) ?? null;
}

export function getNextViewDensity(density: ViewDensity): ViewDensity {
  return density === "cards" ? "table" : "cards";
}
