import {
  diagnoseTorrent,
  ENGINE_API_VERSION,
  type AddTorrentRequest,
  type AddTorrentResponse,
  type EngineHealth,
  type SpeedDiagnostic,
  type TorrentSummary,
} from "@lumatorrent/shared";
import {
  createMockDashboardTorrents,
  createMockTorrent,
  tickTorrent,
} from "../features/downloads/mockEngine";
import type { EngineClient } from "./engineClient";

export class MockEngineClient implements EngineClient {
  private torrents: TorrentSummary[];
  private readonly startedAt = Date.now();

  constructor(initialTorrents: TorrentSummary[] = createMockDashboardTorrents()) {
    this.torrents = initialTorrents;
  }

  async health(): Promise<EngineHealth> {
    return {
      ok: true,
      apiVersion: ENGINE_API_VERSION,
      engineVersion: "0.1.0",
      torrentBackend: "mock",
      uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
      startedAtIso: new Date(this.startedAt).toISOString(),
    };
  }

  async listTorrents(): Promise<TorrentSummary[]> {
    return [...this.torrents];
  }

  async addMagnet(request: AddTorrentRequest): Promise<AddTorrentResponse> {
    const name = extractMagnetName(request.magnetUri) ?? "Legal torrent metadata";
    const torrent = createMockTorrent(
      name,
      "checking",
      0,
      request.startPaused ? "paused" : "metadata",
    );
    this.torrents = [torrent, ...this.torrents];
    return { torrentId: torrent.id, status: torrent.status };
  }

  async pauseTorrent(torrentId: string): Promise<void> {
    this.torrents = this.torrents.map((torrent) =>
      torrent.id === torrentId ? { ...torrent, status: "paused", downloadSpeedBytes: 0 } : torrent,
    );
  }

  async resumeTorrent(torrentId: string): Promise<void> {
    this.torrents = this.torrents.map((torrent) =>
      torrent.id === torrentId && torrent.status === "paused"
        ? { ...torrent, status: "downloading" }
        : torrent,
    );
  }

  async removeTorrent(torrentId: string): Promise<void> {
    this.torrents = this.torrents.filter((torrent) => torrent.id !== torrentId);
  }

  async runDiagnostics(torrentId: string): Promise<SpeedDiagnostic> {
    const torrent = this.torrents.find((item) => item.id === torrentId);
    if (!torrent) {
      return {
        torrentId,
        summary: "Torrent unavailable",
        causes: [],
        recommendations: [],
        generatedAtIso: new Date().toISOString(),
      };
    }
    return diagnoseTorrent(torrent);
  }

  tick(): TorrentSummary[] {
    this.torrents = this.torrents.map(tickTorrent);
    return [...this.torrents];
  }
}

export function createMockEngineClient(initialTorrents?: TorrentSummary[]): MockEngineClient {
  return new MockEngineClient(initialTorrents);
}

function extractMagnetName(magnetUri: string): string | null {
  try {
    const params = new URLSearchParams(magnetUri.replace(/^magnet:\?/, ""));
    return params.get("dn");
  } catch {
    return null;
  }
}
