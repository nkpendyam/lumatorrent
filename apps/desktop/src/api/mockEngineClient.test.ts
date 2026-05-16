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
      magnetUri: "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=Legal%20Dataset",
      savePath: "~/Downloads/LumaTorrent",
    });
    expect(added.status).toBe("metadata");
    await expect(client.listEvents()).resolves.toEqual([
      expect.objectContaining({
        type: "torrent.added",
        torrentId: added.torrentId,
        sequence: 1,
      }),
      expect.objectContaining({
        type: "torrent.metadata",
        torrentId: added.torrentId,
        sequence: 2,
      }),
    ]);
    const addedTorrent = (await client.listTorrents()).find(
      (torrent) => torrent.id === added.torrentId,
    );
    expect(addedTorrent).toMatchObject({
      name: "Legal Dataset",
      infoHash: "0123456789abcdef0123456789abcdef01234567",
      status: "metadata",
      savePath: "~/Downloads/LumaTorrent",
    });
    expect(addedTorrent?.files?.map((file) => file.path)).toContain(
      "Legal Dataset/Legal Dataset.iso",
    );

    await client.pauseTorrent(added.torrentId);
    expect(
      (await client.listTorrents()).find((torrent) => torrent.id === added.torrentId)?.status,
    ).toBe("paused");
    expect((await client.listEvents()).at(-1)).toMatchObject({
      type: "torrent.paused",
      torrentId: added.torrentId,
      sequence: 3,
    });
    await expect(client.listEvents({ after: 2, limit: 1 })).resolves.toEqual([
      expect.objectContaining({
        type: "torrent.paused",
        sequence: 3,
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
    const magnetUri =
      "magnet:?xt=urn:btih:ABCDEF1234567890ABCDEF1234567890ABCDEF12&dn=Legal%20Dataset";

    await expect(
      client.addMagnet({
        magnetUri,
        savePath: "~/Downloads/LumaTorrent",
      }),
    ).resolves.toMatchObject({ status: "metadata" });

    await expect(
      client.addMagnet({
        magnetUri: "magnet:?xt=urn:btih:abcdef1234567890abcdef1234567890abcdef12&dn=Duplicate",
        savePath: "~/Downloads/LumaTorrent",
      }),
    ).rejects.toMatchObject({ code: "DUPLICATE_TORRENT" });
  });

  it("rejects invalid magnet links before adding mock torrents", async () => {
    const client = createMockEngineClient([]);

    await expect(
      client.addMagnet({
        magnetUri: "magnet:?dn=NoHash",
        savePath: "~/Downloads/LumaTorrent",
      }),
    ).rejects.toMatchObject({ code: "INVALID_MAGNET" });
    await expect(client.listTorrents()).resolves.toEqual([]);
  });

  it("extracts normalized magnet info hashes", () => {
    expect(
      extractMagnetInfoHash(
        "magnet:?xt=urn:btih:ABCDEF1234567890ABCDEF1234567890ABCDEF12&dn=Legal",
      ),
    ).toBe("abcdef1234567890abcdef1234567890abcdef12");
    expect(extractMagnetInfoHash("magnet:?dn=NoHash")).toBeNull();
  });
});
