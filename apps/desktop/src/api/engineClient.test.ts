import { describe, expect, it, vi } from "vitest";
import type { ProgressEvent, TorrentSummary } from "@lumatorrent/shared";
import {
  applyEngineEventToTorrents,
  assertLocalEngineUrl,
  EngineClientError,
  createEngineRequestHeaders,
  HttpEngineClient,
  parseEngineEvent,
  UnavailableEngineClient,
} from "./engineClient";

const torrent: TorrentSummary = {
  id: "torrent-1",
  name: "Ubuntu Legal ISO",
  status: "downloading",
  progress: 0.25,
  downloadSpeedBytes: 1_000,
  uploadSpeedBytes: 100,
  etaSeconds: 120,
  health: "good",
  healthConfidence: 0.82,
  seeders: 12,
  peers: 6,
  sizeBytes: 10_000,
  downloadedBytes: 2_500,
  uploadedBytes: 200,
  savePath: "~/Downloads/LumaTorrent",
  addedAtIso: "2026-05-03T00:00:00.000Z",
};

describe("engine client safety", () => {
  it("allows localhost engine URLs", () => {
    expect(() => assertLocalEngineUrl("http://127.0.0.1:19876")).not.toThrow();
    expect(() => assertLocalEngineUrl("http://localhost:19876")).not.toThrow();
  });

  it("rejects non-localhost engine URLs for MVP", () => {
    expect(() => assertLocalEngineUrl("http://0.0.0.0:19876")).toThrow();
    expect(() => assertLocalEngineUrl("http://192.168.1.10:19876")).toThrow();
  });
});

describe("http engine client", () => {
  it("sends local auth headers and parses health", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        ok: true,
        apiVersion: "v1",
        engineVersion: "0.1.0",
        torrentBackend: "mock",
        uptimeSeconds: 10,
      }),
    );
    const client = new HttpEngineClient({
      baseUrl: "http://127.0.0.1:19876/v1",
      token: "test-token",
      fetchImpl,
    });

    await expect(client.health()).resolves.toMatchObject({ ok: true, torrentBackend: "mock" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://127.0.0.1:19876/v1/health",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Luma-Engine-Token": "test-token",
          "X-Luma-Engine-Version": "v1",
        }),
      }),
    );
  });

  it("parses torrent lists, add magnet responses, and safe remove responses", async () => {
    const addedEvent = {
      type: "torrent.added",
      timestamp: "2026-05-03T00:00:00.000Z",
      sequence: 1,
      torrentId: torrent.id,
      payload: { status: torrent.status, summary: torrent },
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([torrent]))
      .mockResolvedValueOnce(jsonResponse({ events: [addedEvent] }))
      .mockResolvedValueOnce(jsonResponse({ torrentId: "torrent-2", status: "metadata" }))
      .mockResolvedValueOnce(jsonResponse({ torrentId: "torrent-file-1", status: "checking" }))
      .mockResolvedValueOnce(
        jsonResponse({
          ok: true,
          removedFromApp: true,
          filesTrashed: [],
          filesMissing: ["missing.iso"],
        }),
      );
    const client = new HttpEngineClient({
      baseUrl: "http://localhost:19876/v1",
      token: "test-token",
      fetchImpl,
    });

    await expect(client.listTorrents()).resolves.toEqual([torrent]);
    await expect(client.listEvents({ after: 0, limit: 10 })).resolves.toEqual([addedEvent]);
    expect(fetchImpl.mock.calls.at(-1)?.[0]).toBe(
      "http://localhost:19876/v1/events?after=0&limit=10",
    );
    await expect(
      client.addMagnet({ magnetUri: "magnet:?xt=urn:btih:abc&dn=Legal", savePath: "~/Downloads" }),
    ).resolves.toEqual({ torrentId: "torrent-2", status: "metadata" });
    await expect(
      client.addTorrentFile({
        torrentFilePath: "C:/Downloads/legal.torrent",
        savePath: "~/Downloads",
      }),
    ).resolves.toEqual({ torrentId: "torrent-file-1", status: "checking" });
    await expect(client.removeTorrent("torrent-2", { deleteFiles: true })).resolves.toEqual({
      ok: true,
      removedFromApp: true,
      filesTrashed: [],
      filesMissing: ["missing.iso"],
    });
    expect(fetchImpl).toHaveBeenLastCalledWith(
      "http://localhost:19876/v1/torrents/torrent-2/remove",
      expect.objectContaining({
        body: JSON.stringify({ deleteFiles: true, useTrash: true }),
        method: "POST",
      }),
    );
  });

  it("normalizes engine errors and unavailable fetch failures", async () => {
    const client = new HttpEngineClient({
      baseUrl: "http://localhost:19876/v1",
      token: "test-token",
      fetchImpl: async () =>
        jsonResponse({ code: "INVALID_MAGNET", message: "Invalid magnet", recoverable: true }, 400),
    });

    await expect(
      client.addMagnet({ magnetUri: "nope", savePath: "~/Downloads" }),
    ).rejects.toMatchObject({
      code: "INVALID_MAGNET",
    });

    const unavailable = new HttpEngineClient({
      baseUrl: "http://localhost:19876/v1",
      token: "test-token",
      fetchImpl: async () => {
        throw new TypeError("offline");
      },
    });

    await expect(unavailable.health()).rejects.toMatchObject({ code: "ENGINE_UNAVAILABLE" });
  });

  it("builds auth headers without logging token material", () => {
    const headers = createEngineRequestHeaders("secret-token");

    expect(headers["X-Luma-Engine-Token"]).toBe("secret-token");
    expect(Object.keys(headers)).toContain("X-Luma-Engine-Version");
  });

  it("times out unavailable local engine requests", async () => {
    const client = new HttpEngineClient({
      baseUrl: "http://localhost:19876/v1",
      token: "test-token",
      timeoutMs: 1,
      fetchImpl: (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    });

    await expect(client.health()).rejects.toMatchObject({ code: "ENGINE_UNAVAILABLE" });
  });
});

describe("engine events", () => {
  it("parses and applies progress events", () => {
    const event: ProgressEvent = parseEngineEvent({
      type: "torrent.progress",
      timestamp: "2026-05-03T00:00:00.000Z",
      sequence: 1,
      torrentId: torrent.id,
      payload: {
        progress: 0.5,
        downloadSpeedBytes: 2_000,
        uploadSpeedBytes: 300,
        etaSeconds: 60,
      },
    }) as ProgressEvent;

    expect(applyEngineEventToTorrents([torrent], event)[0]).toMatchObject({
      progress: 0.5,
      downloadSpeedBytes: 2_000,
    });
  });

  it("applies added events by prepending new torrent summaries", () => {
    const added = { ...torrent, id: "torrent-2", name: "Added legal torrent" };

    const next = applyEngineEventToTorrents([torrent], {
      type: "torrent.added",
      timestamp: "2026-05-03T00:00:00.000Z",
      sequence: 2,
      torrentId: added.id,
      payload: {
        status: "metadata",
        summary: added,
      },
    });

    expect(next.map((item) => item.id)).toEqual(["torrent-2", "torrent-1"]);
  });

  it("rejects malformed events", () => {
    expect(() => parseEngineEvent({ type: "torrent.progress", payload: {} })).toThrow(
      EngineClientError,
    );
  });
});

describe("unavailable engine fallback", () => {
  it("returns safe health and empty torrents without crashing", async () => {
    const client = new UnavailableEngineClient();

    await expect(client.health()).resolves.toMatchObject({ ok: false, torrentBackend: "mock" });
    await expect(client.listTorrents()).resolves.toEqual([]);
    await expect(client.pauseTorrent("missing")).rejects.toMatchObject({
      code: "ENGINE_UNAVAILABLE",
    });
  });
});

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
