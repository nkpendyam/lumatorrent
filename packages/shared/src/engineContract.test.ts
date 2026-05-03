import { describe, expect, it } from "vitest";
import {
  createEngineUnavailableError,
  engineErrorCodes,
  engineEventTypes,
  engineRequiredPaths,
  isEngineError,
  isEngineEvent,
  isEngineHealth,
  isTorrentSummary,
  normalizeEngineError,
} from "./engineContract";
import type { EngineHealth, ProgressEvent, TorrentSummary } from "./types";

const torrent: TorrentSummary = {
  id: "torrent-1",
  name: "Ubuntu Legal ISO",
  status: "downloading",
  progress: 0.42,
  downloadSpeedBytes: 1_000,
  uploadSpeedBytes: 100,
  etaSeconds: 60,
  health: "good",
  healthConfidence: 0.82,
  seeders: 12,
  peers: 8,
  sizeBytes: 10_000,
  downloadedBytes: 4_200,
  uploadedBytes: 500,
  savePath: "~/Downloads/LumaTorrent",
  addedAtIso: "2026-05-03T00:00:00.000Z",
};

describe("engine contract guards", () => {
  it("keeps required paths, event types, and error codes explicit", () => {
    expect(engineRequiredPaths).toContain("/torrents/{id}/recheck");
    expect(engineEventTypes).toContain("torrent.progress");
    expect(engineEventTypes).toContain("engine.health");
    expect(engineErrorCodes).toContain("ENGINE_UNAVAILABLE");
  });

  it("validates engine health", () => {
    const health: EngineHealth = {
      ok: true,
      apiVersion: "v1",
      engineVersion: "0.1.0",
      torrentBackend: "mock",
      uptimeSeconds: 12,
    };

    expect(isEngineHealth(health)).toBe(true);
    expect(isEngineHealth({ ...health, apiVersion: "v2" })).toBe(false);
  });

  it("validates torrent summaries and progress events", () => {
    const event: ProgressEvent = {
      type: "torrent.progress",
      timestamp: "2026-05-03T00:00:00.000Z",
      sequence: 1,
      torrentId: torrent.id,
      payload: {
        progress: 0.5,
        downloadSpeedBytes: 2_000,
        uploadSpeedBytes: 200,
        etaSeconds: 30,
      },
    };

    expect(isTorrentSummary(torrent)).toBe(true);
    expect(isEngineEvent(event)).toBe(true);
    const malformedPayload = { ...event.payload, downloadSpeed: 2_000 };
    delete (malformedPayload as Partial<typeof event.payload>).downloadSpeedBytes;
    expect(isEngineEvent({ ...event, payload: malformedPayload })).toBe(false);
  });

  it("validates state and diagnostic events", () => {
    expect(
      isEngineEvent({
        type: "torrent.paused",
        timestamp: "2026-05-03T00:00:00.000Z",
        sequence: 2,
        torrentId: torrent.id,
        payload: { status: "paused", summary: { ...torrent, status: "paused" } },
      }),
    ).toBe(true);

    expect(
      isEngineEvent({
        type: "diagnostic.updated",
        timestamp: "2026-05-03T00:00:00.000Z",
        sequence: 3,
        torrentId: torrent.id,
        payload: {
          torrentId: torrent.id,
          summary: "Weak availability",
          causes: [],
          recommendations: [],
          generatedAtIso: "2026-05-03T00:00:00.000Z",
        },
      }),
    ).toBe(true);
  });

  it("normalizes malformed engine errors safely", () => {
    expect(isEngineError(createEngineUnavailableError())).toBe(true);
    expect(
      normalizeEngineError({ code: "INVALID_MAGNET", message: "Bad magnet", recoverable: false }),
    ).toEqual({
      code: "INVALID_MAGNET",
      message: "Bad magnet",
      recoverable: false,
    });
    expect(normalizeEngineError({ code: "NOPE", message: "Unknown" })).toEqual({
      code: "ENGINE_UNAVAILABLE",
      message: "Unknown",
      details: undefined,
      recoverable: true,
    });
  });
});
