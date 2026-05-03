export type TorrentStatus =
  | "checking"
  | "metadata"
  | "downloading"
  | "paused"
  | "completed"
  | "seeding"
  | "error";

export type TorrentHealth = "checking" | "excellent" | "good" | "weak" | "dead";

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

export type AddMagnetInput = {
  magnetUri: string;
  savePath: string;
  startPaused?: boolean;
};

export type RemoveTorrentOptions = {
  deleteFiles: boolean;
  useTrash: true;
};
