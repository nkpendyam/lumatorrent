import type { SpeedDiagnostic, TorrentSummary } from "@lumatorrent/shared";

export type EngineHealth = {
  ok: boolean;
  engineVersion: string;
  torrentBackend: "mock" | "libtorrent";
  uptimeSeconds: number;
};

export type AddMagnetRequest = {
  magnetUri: string;
  savePath: string;
  selectedFiles?: string[] | null;
};

export interface EngineClient {
  health(): Promise<EngineHealth>;
  listTorrents(): Promise<TorrentSummary[]>;
  addMagnet(request: AddMagnetRequest): Promise<{ torrentId: string; status: string }>;
  pauseTorrent(torrentId: string): Promise<void>;
  resumeTorrent(torrentId: string): Promise<void>;
  removeTorrent(torrentId: string): Promise<void>;
  runDiagnostics(torrentId: string): Promise<SpeedDiagnostic>;
}

export class EngineClientError extends Error {
  constructor(message: string, public readonly code = "ENGINE_CLIENT_ERROR") {
    super(message);
    this.name = "EngineClientError";
  }
}

export function assertLocalEngineUrl(url: string): void {
  const parsed = new URL(url);
  if (!["127.0.0.1", "localhost"].includes(parsed.hostname)) {
    throw new EngineClientError("Engine API must be bound to localhost in MVP.", "UNSAFE_ENGINE_BIND");
  }
}
