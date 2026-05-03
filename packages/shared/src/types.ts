export type TorrentStatus =
  | "checking"
  | "metadata"
  | "downloading"
  | "paused"
  | "completed"
  | "seeding"
  | "error";

export type TorrentHealth = "checking" | "excellent" | "good" | "weak" | "dead";

export const ENGINE_API_VERSION = "v1";

export type EngineApiVersion = typeof ENGINE_API_VERSION;

export type EngineBackend = "mock" | "stub" | "libtorrent";

export type EngineHealth = {
  ok: boolean;
  apiVersion: EngineApiVersion;
  engineVersion: string;
  torrentBackend: EngineBackend;
  uptimeSeconds: number;
  startedAtIso?: string;
};

export type TorrentSummary = {
  id: string;
  name: string;
  status: TorrentStatus;
  progress: number;
  downloadSpeedBytes: number;
  uploadSpeedBytes: number;
  etaSeconds: number | null;
  health: TorrentHealth;
  healthConfidence: number;
  seeders: number;
  peers: number;
  sizeBytes: number;
  downloadedBytes: number;
  uploadedBytes: number;
  savePath: string;
  addedAtIso: string;
};

export type TorrentFile = {
  id: string;
  path: string;
  sizeBytes: number;
  progress: number;
  priority: "skip" | "low" | "normal" | "high";
  risk: "normal" | "executable" | "archive" | "unknown";
};

export type DiagnosticSeverity = "info" | "warning" | "critical";

export type DiagnosticCauseCode =
  | "LOW_SEEDERS"
  | "NO_SEEDERS"
  | "CLOSED_PORT"
  | "TRACKER_TIMEOUT"
  | "DHT_DISABLED"
  | "VPN_MAY_BLOCK"
  | "DISK_SLOW"
  | "QUEUE_CONGESTION"
  | "FETCHING_METADATA"
  | "UNKNOWN";

export type DiagnosticCause = {
  code: DiagnosticCauseCode;
  severity: DiagnosticSeverity;
  title: string;
  message: string;
  technicalDetails?: string;
};

export type Recommendation = {
  id: string;
  label: string;
  description: string;
  action?: "refresh-trackers" | "check-port" | "reduce-active-downloads" | "open-settings";
};

export type SpeedDiagnostic = {
  torrentId: string;
  summary: string;
  causes: DiagnosticCause[];
  recommendations: Recommendation[];
  generatedAtIso: string;
};

export type AddTorrentRequest = {
  magnetUri: string;
  savePath: string;
  selectedFiles?: string[] | null;
  startPaused?: boolean;
};

export type AddTorrentResponse = {
  torrentId: string;
  status: TorrentStatus;
};

export type AddMagnetInput = AddTorrentRequest;

export type RemoveTorrentOptions = {
  deleteFiles: boolean;
  useTrash: true;
};

export type EngineErrorCode =
  | "INVALID_MAGNET"
  | "TORRENT_PARSE_FAILED"
  | "METADATA_TIMEOUT"
  | "NO_SEEDERS_OBSERVED"
  | "PORT_CLOSED"
  | "TRACKER_TIMEOUT"
  | "DHT_UNAVAILABLE"
  | "DISK_FULL"
  | "PERMISSION_DENIED"
  | "PATH_REJECTED"
  | "ENGINE_UNAVAILABLE";

export type EngineError = {
  code: EngineErrorCode;
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
};

export type EngineEventType =
  | "torrent.added"
  | "torrent.metadata"
  | "torrent.progress"
  | "torrent.completed"
  | "torrent.paused"
  | "torrent.error"
  | "engine.restarted"
  | "engine.health"
  | "engine.crashed"
  | "diagnostic.updated";

export type BaseEngineEvent = {
  type: EngineEventType;
  timestamp: string;
  sequence: number;
};

export type ProgressEvent = BaseEngineEvent & {
  type: "torrent.progress";
  torrentId: string;
  payload: {
    progress: number;
    downloadSpeedBytes: number;
    uploadSpeedBytes: number;
    etaSeconds: number | null;
  };
};

export type StateChangedEvent = BaseEngineEvent & {
  type:
    | "torrent.added"
    | "torrent.metadata"
    | "torrent.completed"
    | "torrent.paused"
    | "torrent.error";
  torrentId: string;
  payload: {
    status: TorrentStatus;
    summary?: TorrentSummary;
    error?: EngineError;
  };
};

export type DiagnosticEvent = BaseEngineEvent & {
  type: "diagnostic.updated";
  torrentId: string;
  payload: SpeedDiagnostic;
};

export type EngineLifecycleEvent = BaseEngineEvent & {
  type: "engine.restarted" | "engine.health" | "engine.crashed";
  payload: {
    health?: EngineHealth;
    error?: EngineError;
  };
};

export type EngineEvent =
  | ProgressEvent
  | StateChangedEvent
  | DiagnosticEvent
  | EngineLifecycleEvent;
