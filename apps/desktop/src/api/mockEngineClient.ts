import {
  diagnoseTorrent,
  ENGINE_API_VERSION,
  type AddTorrentRequest,
  type AddTorrentFileRequest,
  type AddTorrentResponse,
  type EngineEvent,
  type EngineHealth,
  type RemoveTorrentOptions,
  type RemoveTorrentResponse,
  type SpeedDiagnostic,
  type TorrentSummary,
} from "@lumatorrent/shared";
import {
  createMockDashboardTorrents,
  createMockTorrent,
  tickTorrent,
} from "../features/downloads/mockEngine";
import { EngineClientError, type EngineClient, type ListEngineEventsOptions } from "./engineClient";

export class MockEngineClient implements EngineClient {
  private torrents: TorrentSummary[];
  private events: EngineEvent[] = [];
  private sequence = 1;
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

  async listEvents(options: ListEngineEventsOptions = {}): Promise<EngineEvent[]> {
    return this.events
      .filter((event) => options.after === undefined || event.sequence > options.after)
      .slice(0, options.limit);
  }

  async addMagnet(request: AddTorrentRequest): Promise<AddTorrentResponse> {
    const name = extractMagnetName(request.magnetUri) ?? "Legal torrent metadata";
    const infoHash = extractMagnetInfoHash(request.magnetUri);
    if (
      infoHash &&
      this.torrents.some((torrent) => normalizeInfoHash(torrent.infoHash) === infoHash)
    ) {
      throw new EngineClientError("This torrent is already in the list.", "DUPLICATE_TORRENT");
    }
    const torrent = createMockTorrent(
      name,
      "checking",
      0,
      request.startPaused ? "paused" : "metadata",
    );
    torrent.infoHash = infoHash;
    this.torrents = [torrent, ...this.torrents];
    this.emitStateEvent("torrent.added", torrent);
    return { torrentId: torrent.id, status: torrent.status };
  }

  async addTorrentFile(request: AddTorrentFileRequest): Promise<AddTorrentResponse> {
    const name = basename(request.torrentFilePath).replace(/\.torrent$/i, "") || "Torrent file";
    const torrent = createMockTorrent(
      name,
      "checking",
      0,
      request.startPaused ? "paused" : "checking",
    );
    this.torrents = [torrent, ...this.torrents];
    this.emitStateEvent("torrent.added", torrent);
    return { torrentId: torrent.id, status: torrent.status };
  }

  async pauseTorrent(torrentId: string): Promise<void> {
    this.torrents = this.torrents.map((torrent) =>
      torrent.id === torrentId ? { ...torrent, status: "paused", downloadSpeedBytes: 0 } : torrent,
    );
    this.emitKnownTorrentState(torrentId, "torrent.paused");
  }

  async resumeTorrent(torrentId: string): Promise<void> {
    this.torrents = this.torrents.map((torrent) =>
      torrent.id === torrentId && torrent.status === "paused"
        ? { ...torrent, status: "downloading" }
        : torrent,
    );
    this.emitKnownTorrentState(torrentId, "torrent.metadata");
  }

  async removeTorrent(
    torrentId: string,
    _options: RemoveTorrentOptions = {},
  ): Promise<RemoveTorrentResponse> {
    this.torrents = this.torrents.filter((torrent) => torrent.id !== torrentId);
    return { ok: true, removedFromApp: true, filesTrashed: [], filesMissing: [] };
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

  private emitKnownTorrentState(torrentId: string, type: "torrent.paused" | "torrent.metadata") {
    const torrent = this.torrents.find((item) => item.id === torrentId);
    if (torrent) this.emitStateEvent(type, torrent);
  }

  private emitStateEvent(
    type: "torrent.added" | "torrent.paused" | "torrent.metadata",
    torrent: TorrentSummary,
  ) {
    this.events.push({
      type,
      timestamp: new Date().toISOString(),
      sequence: this.sequence,
      torrentId: torrent.id,
      payload: {
        status: torrent.status,
        summary: torrent,
      },
    });
    this.sequence += 1;
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

export function extractMagnetInfoHash(magnetUri: string): string | null {
  try {
    const params = new URLSearchParams(magnetUri.replace(/^magnet:\?/, ""));
    const exactTopic = params.get("xt");
    const match = exactTopic?.match(/^urn:btih:([^&]+)$/i);
    return match ? normalizeInfoHash(match[1]) : null;
  } catch {
    return null;
  }
}

function normalizeInfoHash(value: string | null | undefined): string | null {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

function basename(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}
