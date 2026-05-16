import {
  createEngineUnavailableError,
  ENGINE_API_VERSION,
  isEngineEvent,
  isEngineHealth,
  isSpeedDiagnostic,
  isTorrentSummary,
  normalizeEngineError,
  type AddTorrentRequest,
  type AddTorrentFileRequest,
  type AddTorrentResponse,
  type EngineError,
  type EngineEvent,
  type EngineHealth,
  type RemoveTorrentOptions,
  type RemoveTorrentResponse,
  type SpeedDiagnostic,
  type TorrentSummary,
} from "@lumatorrent/shared";

export type AddMagnetRequest = AddTorrentRequest;
export type ListEngineEventsOptions = {
  after?: number;
  limit?: number;
};

export interface EngineClient {
  health(): Promise<EngineHealth>;
  listTorrents(): Promise<TorrentSummary[]>;
  listEvents(options?: ListEngineEventsOptions): Promise<EngineEvent[]>;
  addMagnet(request: AddTorrentRequest): Promise<AddTorrentResponse>;
  addTorrentFile(request: AddTorrentFileRequest): Promise<AddTorrentResponse>;
  pauseTorrent(torrentId: string): Promise<void>;
  resumeTorrent(torrentId: string): Promise<void>;
  removeTorrent(torrentId: string, options?: RemoveTorrentOptions): Promise<RemoveTorrentResponse>;
  runDiagnostics(torrentId: string): Promise<SpeedDiagnostic>;
}

export class EngineClientError extends Error {
  constructor(
    message: string,
    public readonly code = "ENGINE_CLIENT_ERROR",
    public readonly engineError?: EngineError,
  ) {
    super(message);
    this.name = "EngineClientError";
  }
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type HttpEngineClientOptions = {
  baseUrl: string;
  token: string;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
};

export function assertLocalEngineUrl(url: string): void {
  const parsed = new URL(url);
  if (!["127.0.0.1", "localhost"].includes(parsed.hostname)) {
    throw new EngineClientError(
      "Engine API must be bound to localhost in MVP.",
      "UNSAFE_ENGINE_BIND",
    );
  }
}

export class HttpEngineClient implements EngineClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: FetchLike;

  constructor(options: HttpEngineClientOptions) {
    assertLocalEngineUrl(options.baseUrl);
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
    this.timeoutMs = options.timeoutMs ?? 5_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async health(): Promise<EngineHealth> {
    const payload = await this.requestJson("/health");
    if (!isEngineHealth(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid health payload.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  async listTorrents(): Promise<TorrentSummary[]> {
    const payload = await this.requestJson("/torrents");
    if (!Array.isArray(payload) || !payload.every(isTorrentSummary)) {
      throw new EngineClientError(
        "Engine returned an invalid torrent list.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  async listEvents(options: ListEngineEventsOptions = {}): Promise<EngineEvent[]> {
    const query = new URLSearchParams();
    if (options.after !== undefined) query.set("after", String(options.after));
    if (options.limit !== undefined) query.set("limit", String(options.limit));
    const payload = await this.requestJson(`/events${query.size > 0 ? `?${query}` : ""}`);
    if (!isEngineEventsResponse(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid event list.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload.events;
  }

  async addMagnet(request: AddTorrentRequest): Promise<AddTorrentResponse> {
    const payload = await this.requestJson("/torrents/magnet", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (!isAddTorrentResponse(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid add torrent response.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  async addTorrentFile(request: AddTorrentFileRequest): Promise<AddTorrentResponse> {
    const payload = await this.requestJson("/torrents/file", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (!isAddTorrentResponse(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid add torrent response.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  async pauseTorrent(torrentId: string): Promise<void> {
    await this.requestJson(`/torrents/${encodeURIComponent(torrentId)}/pause`, { method: "POST" });
  }

  async resumeTorrent(torrentId: string): Promise<void> {
    await this.requestJson(`/torrents/${encodeURIComponent(torrentId)}/resume`, { method: "POST" });
  }

  async removeTorrent(
    torrentId: string,
    options: RemoveTorrentOptions = {},
  ): Promise<RemoveTorrentResponse> {
    const payload = await this.requestJson(`/torrents/${encodeURIComponent(torrentId)}/remove`, {
      method: "POST",
      body: JSON.stringify({
        deleteFiles: options.deleteFiles ?? false,
        useTrash: options.useTrash ?? true,
      }),
    });
    if (!isRemoveTorrentResponse(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid remove torrent response.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  async runDiagnostics(torrentId: string): Promise<SpeedDiagnostic> {
    const payload = await this.requestJson(`/torrents/${encodeURIComponent(torrentId)}/diagnose`, {
      method: "POST",
    });
    if (!isSpeedDiagnostic(payload)) {
      throw new EngineClientError(
        "Engine returned an invalid diagnostic payload.",
        "ENGINE_CONTRACT_MISMATCH",
      );
    }
    return payload;
  }

  private async requestJson(path: string, init: RequestInit = {}): Promise<unknown> {
    let response: Response;
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        ...init,
        signal: init.signal ?? controller.signal,
        headers: {
          ...createEngineRequestHeaders(this.token),
          ...init.headers,
        },
      });
    } catch {
      const error = createEngineUnavailableError("Engine request failed.");
      throw new EngineClientError(error.message, error.code, error);
    } finally {
      globalThis.clearTimeout(timeoutId);
    }

    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      const error = normalizeEngineError(payload);
      throw new EngineClientError(error.message, error.code, error);
    }
    return payload;
  }
}

export function createEngineRequestHeaders(token: string): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Luma-Engine-Token": token,
    "X-Luma-Engine-Version": ENGINE_API_VERSION,
  };
}

export class UnavailableEngineClient implements EngineClient {
  async health(): Promise<EngineHealth> {
    return {
      ok: false,
      apiVersion: ENGINE_API_VERSION,
      engineVersion: "unavailable",
      torrentBackend: "mock",
      uptimeSeconds: 0,
    };
  }

  async listTorrents(): Promise<TorrentSummary[]> {
    return [];
  }

  async listEvents(): Promise<EngineEvent[]> {
    return [];
  }

  async addMagnet(): Promise<AddTorrentResponse> {
    throw unavailableEngineClientError();
  }

  async addTorrentFile(): Promise<AddTorrentResponse> {
    throw unavailableEngineClientError();
  }

  async pauseTorrent(_torrentId: string): Promise<void> {
    throw unavailableEngineClientError();
  }

  async resumeTorrent(_torrentId: string): Promise<void> {
    throw unavailableEngineClientError();
  }

  async removeTorrent(_torrentId: string): Promise<RemoveTorrentResponse> {
    throw unavailableEngineClientError();
  }

  async runDiagnostics(_torrentId: string): Promise<SpeedDiagnostic> {
    throw unavailableEngineClientError();
  }
}

export function parseEngineEvent(value: unknown): EngineEvent {
  if (!isEngineEvent(value)) {
    throw new EngineClientError(
      "Engine emitted an invalid event payload.",
      "ENGINE_CONTRACT_MISMATCH",
    );
  }
  return value;
}

export function applyEngineEventToTorrents(
  torrents: TorrentSummary[],
  event: EngineEvent,
): TorrentSummary[] {
  if (event.type === "torrent.progress") {
    return torrents.map((torrent) =>
      torrent.id === event.torrentId
        ? {
            ...torrent,
            progress: event.payload.progress,
            downloadSpeedBytes: event.payload.downloadSpeedBytes,
            uploadSpeedBytes: event.payload.uploadSpeedBytes,
            etaSeconds: event.payload.etaSeconds,
          }
        : torrent,
    );
  }

  if (
    event.type === "torrent.added" ||
    event.type === "torrent.metadata" ||
    event.type === "torrent.completed" ||
    event.type === "torrent.paused" ||
    event.type === "torrent.error"
  ) {
    if (event.type === "torrent.added" && event.payload.summary) {
      const exists = torrents.some((torrent) => torrent.id === event.torrentId);
      return exists ? torrents : [event.payload.summary, ...torrents];
    }

    return torrents.map((torrent) =>
      torrent.id === event.torrentId
        ? { ...torrent, status: event.payload.status, ...(event.payload.summary ?? {}) }
        : torrent,
    );
  }

  return torrents;
}

function isEngineEventsResponse(value: unknown): value is { events: EngineEvent[] } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.events) && record.events.every(isEngineEvent);
}

function isAddTorrentResponse(value: unknown): value is AddTorrentResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.torrentId === "string" &&
    typeof record.status === "string" &&
    ["checking", "metadata", "downloading", "paused", "completed", "seeding", "error"].includes(
      record.status,
    )
  );
}

function isRemoveTorrentResponse(value: unknown): value is RemoveTorrentResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    record.ok === true &&
    record.removedFromApp === true &&
    Array.isArray(record.filesTrashed) &&
    record.filesTrashed.every((item) => typeof item === "string") &&
    Array.isArray(record.filesMissing) &&
    record.filesMissing.every((item) => typeof item === "string")
  );
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: "Engine returned malformed JSON." };
  }
}

function unavailableEngineClientError(): EngineClientError {
  const error = createEngineUnavailableError();
  return new EngineClientError(error.message, error.code, error);
}
