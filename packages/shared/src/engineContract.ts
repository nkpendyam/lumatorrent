import {
  ENGINE_API_VERSION,
  type EngineError,
  type EngineErrorCode,
  type EngineEvent,
  type EngineEventType,
  type EngineHealth,
  type SpeedDiagnostic,
  type TorrentHealth,
  type TorrentStatus,
  type TorrentSummary,
} from "./types";

export const engineRequiredPaths = [
  "/health",
  "/torrents",
  "/torrents/magnet",
  "/torrents/file",
  "/torrents/{id}/pause",
  "/torrents/{id}/resume",
  "/torrents/{id}/remove",
  "/torrents/{id}/recheck",
  "/torrents/{id}/diagnose",
  "/events",
] as const;

export const engineEventTypes = [
  "torrent.added",
  "torrent.metadata",
  "torrent.progress",
  "torrent.completed",
  "torrent.paused",
  "torrent.error",
  "engine.restarted",
  "engine.health",
  "engine.crashed",
  "diagnostic.updated",
] as const satisfies readonly EngineEventType[];

export const engineErrorCodes = [
  "INVALID_MAGNET",
  "TORRENT_PARSE_FAILED",
  "METADATA_TIMEOUT",
  "NO_SEEDERS_OBSERVED",
  "PORT_CLOSED",
  "TRACKER_TIMEOUT",
  "DHT_UNAVAILABLE",
  "DISK_FULL",
  "PERMISSION_DENIED",
  "PATH_REJECTED",
  "ENGINE_UNAVAILABLE",
] as const satisfies readonly EngineErrorCode[];

const torrentStatuses = [
  "checking",
  "metadata",
  "downloading",
  "paused",
  "completed",
  "seeding",
  "error",
] as const satisfies readonly TorrentStatus[];

const torrentHealthValues = [
  "checking",
  "excellent",
  "good",
  "weak",
  "dead",
] as const satisfies readonly TorrentHealth[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isTorrentStatus(value: unknown): value is TorrentStatus {
  return isString(value) && torrentStatuses.includes(value as TorrentStatus);
}

function isTorrentHealth(value: unknown): value is TorrentHealth {
  return isString(value) && torrentHealthValues.includes(value as TorrentHealth);
}

function isEngineEventType(value: unknown): value is EngineEventType {
  return isString(value) && engineEventTypes.includes(value as EngineEventType);
}

function isEngineErrorCode(value: unknown): value is EngineErrorCode {
  return isString(value) && engineErrorCodes.includes(value as EngineErrorCode);
}

export function isEngineHealth(value: unknown): value is EngineHealth {
  if (!isRecord(value)) return false;
  return (
    (value.ok === true || value.ok === false) &&
    value.apiVersion === ENGINE_API_VERSION &&
    isString(value.engineVersion) &&
    ["mock", "stub", "libtorrent"].includes(String(value.torrentBackend)) &&
    isNumber(value.uptimeSeconds) &&
    (value.startedAtIso === undefined || isString(value.startedAtIso))
  );
}

export function isEngineError(value: unknown): value is EngineError {
  if (!isRecord(value)) return false;
  return (
    isEngineErrorCode(value.code) &&
    isString(value.message) &&
    isBoolean(value.recoverable) &&
    (value.details === undefined || isRecord(value.details))
  );
}

export function isTorrentSummary(value: unknown): value is TorrentSummary {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.name) &&
    isTorrentStatus(value.status) &&
    isNumber(value.progress) &&
    isNumber(value.downloadSpeedBytes) &&
    isNumber(value.uploadSpeedBytes) &&
    (value.etaSeconds === null || isNumber(value.etaSeconds)) &&
    isTorrentHealth(value.health) &&
    isNumber(value.healthConfidence) &&
    isNumber(value.seeders) &&
    isNumber(value.peers) &&
    isNumber(value.sizeBytes) &&
    isNumber(value.downloadedBytes) &&
    isNumber(value.uploadedBytes) &&
    isString(value.savePath) &&
    isString(value.addedAtIso)
  );
}

export function isSpeedDiagnostic(value: unknown): value is SpeedDiagnostic {
  if (!isRecord(value)) return false;
  return (
    isString(value.torrentId) &&
    isString(value.summary) &&
    Array.isArray(value.causes) &&
    Array.isArray(value.recommendations) &&
    isString(value.generatedAtIso)
  );
}

export function isEngineEvent(value: unknown): value is EngineEvent {
  if (
    !isRecord(value) ||
    !isEngineEventType(value.type) ||
    !isString(value.timestamp) ||
    !isNumber(value.sequence)
  ) {
    return false;
  }

  if (value.type.startsWith("torrent.") || value.type === "diagnostic.updated") {
    if (!isString(value.torrentId) || !isRecord(value.payload)) return false;
  }

  if (value.type === "torrent.progress") {
    const payload = value.payload;
    return (
      isRecord(payload) &&
      isNumber(payload.progress) &&
      isNumber(payload.downloadSpeedBytes) &&
      isNumber(payload.uploadSpeedBytes) &&
      (payload.etaSeconds === null || isNumber(payload.etaSeconds))
    );
  }

  if (value.type === "diagnostic.updated") {
    return isSpeedDiagnostic(value.payload);
  }

  if (value.type.startsWith("torrent.")) {
    const payload = value.payload;
    return (
      isRecord(payload) &&
      isTorrentStatus(payload.status) &&
      (payload.summary === undefined || isTorrentSummary(payload.summary)) &&
      (payload.error === undefined || isEngineError(payload.error))
    );
  }

  const payload = value.payload;
  return (
    isRecord(payload) &&
    (payload.health === undefined || isEngineHealth(payload.health)) &&
    (payload.error === undefined || isEngineError(payload.error))
  );
}

export function normalizeEngineError(
  value: unknown,
  fallback: EngineErrorCode = "ENGINE_UNAVAILABLE",
): EngineError {
  if (isEngineError(value)) return value;
  if (isRecord(value) && isString(value.message)) {
    return {
      code: isEngineErrorCode(value.code) ? value.code : fallback,
      message: value.message,
      details: isRecord(value.details) ? value.details : undefined,
      recoverable: value.recoverable === false ? false : true,
    };
  }
  return createEngineUnavailableError();
}

export function createEngineUnavailableError(message = "Engine is unavailable."): EngineError {
  return {
    code: "ENGINE_UNAVAILABLE",
    message,
    recoverable: true,
  };
}
