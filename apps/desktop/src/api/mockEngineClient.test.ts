import { describe, expect, it } from "vitest";
import { createMockEngineClient, extractMagnetInfoHash } from "./mockEngineClient";

describe("mock engine client", () => {
  it("implements health, list, add, and mock state transitions", async () => {
    const client = createMockEngineClient();
    const initial = await client.listTorrents();
    const health = await client.health();

    expect(health).toMatchObject({ ok: true, apiVersion: "v1", torrentBackend: "mock" });
    expect(initial.length).toBeGreaterThan(0);

    const added = await client.addMagnet({
      magnetUri: "magnet:?xt=urn:btih:abc&dn=Legal%20Dataset",
      savePath: "~/Downloads/LumaTorrent",
    });
    expect(added.status).toBe("metadata");
    await expect(client.listEvents()).resolves.toEqual([
      expect.objectContaining({
        type: "torrent.added",
        torrentId: added.torrentId,
        sequence: 1,
      }),
    ]);

    await client.pauseTorrent(added.torrentId);
    expect(
      (await client.listTorrents()).find((torrent) => torrent.id === added.torrentId)?.status,
    ).toBe("paused");
    expect((await client.listEvents()).at(-1)).toMatchObject({
      type: "torrent.paused",
      torrentId: added.torrentId,
      sequence: 2,
    });
    await expect(client.listEvents({ after: 1, limit: 1 })).resolves.toEqual([
      expect.objectContaining({
        type: "torrent.paused",
        sequence: 2,
      }),
    ]);

    await client.resumeTorrent(added.torrentId);
    expect(
      (await client.listTorrents()).find((torrent) => torrent.id === added.torrentId)?.status,
    ).toBe("downloading");

    const fileAdded = await client.addTorrentFile({
      torrentFilePath: "C:/Downloads/legal-dataset.torrent",
      savePath: "~/Downloads/LumaTorrent",
    });
    expect(fileAdded.status).toBe("checking");

    await expect(client.removeTorrent(added.torrentId)).resolves.toMatchObject({
      ok: true,
      removedFromApp: true,
      filesTrashed: [],
    });
    expect((await client.listTorrents()).some((torrent) => torrent.id === added.torrentId)).toBe(
      false,
    );
  });

  it("returns diagnostics for known and missing torrents", async () => {
    const client = createMockEngineClient();
    const [torrent] = await client.listTorrents();

    await expect(client.runDiagnostics(torrent.id)).resolves.toMatchObject({
      torrentId: torrent.id,
    });
    await expect(client.runDiagnostics("missing")).resolves.toMatchObject({
      summary: "Torrent unavailable",
    });
  });

  it("rejects duplicate magnet info hashes", async () => {
    const client = createMockEngineClient([]);
    const magnetUri = "magnet:?xt=urn:btih:ABCDEF1234567890&dn=Legal%20Dataset";

    await expect(
      client.addMagnet({
        magnetUri,
        savePath: "~/Downloads/LumaTorrent",
      }),
    ).resolves.toMatchObject({ status: "metadata" });

    await expect(
      client.addMagnet({
        magnetUri: "magnet:?xt=urn:btih:abcdef1234567890&dn=Duplicate",
        savePath: "~/Downloads/LumaTorrent",
      }),
    ).rejects.toMatchObject({ code: "DUPLICATE_TORRENT" });
  });

  it("extracts normalized magnet info hashes", () => {
    expect(extractMagnetInfoHash("magnet:?xt=urn:btih:ABC123&dn=Legal")).toBe("abc123");
    expect(extractMagnetInfoHash("magnet:?dn=NoHash")).toBeNull();
  });
});
