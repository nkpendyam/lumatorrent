import { describe, expect, it } from "vitest";
import { createMockEngineClient } from "./mockEngineClient";

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

    await client.pauseTorrent(added.torrentId);
    expect(
      (await client.listTorrents()).find((torrent) => torrent.id === added.torrentId)?.status,
    ).toBe("paused");

    await client.resumeTorrent(added.torrentId);
    expect(
      (await client.listTorrents()).find((torrent) => torrent.id === added.torrentId)?.status,
    ).toBe("downloading");

    await client.removeTorrent(added.torrentId);
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
});
