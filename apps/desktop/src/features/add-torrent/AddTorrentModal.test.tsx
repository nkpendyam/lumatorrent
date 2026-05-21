import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AddTorrentModal } from "./AddTorrentModal";
import {
  createMockMetadataPreview,
  getHighestRiskWarning,
  isTorrentFilePath,
  validateMagnetUri,
} from "./addTorrentModel";

describe("AddTorrentModal", () => {
  it("renders a warning for selected executable files", () => {
    const html = renderToStaticMarkup(
      <AddTorrentModal
        onAddMagnet={vi.fn()}
        onClose={vi.fn()}
        selectedFileNames={["Ubuntu/setup.exe", "readme.txt"]}
      />,
    );

    expect(html).toContain("Potentially unsafe file");
    expect(html).toContain("setup.exe");
    expect(html).toContain("Executable or script file");
    expect(html).toContain('role="alert"');
  });

  it("renders the torrent file import path controls", () => {
    const html = renderToStaticMarkup(<AddTorrentModal onAddMagnet={vi.fn()} onClose={vi.fn()} />);

    expect(html).toContain("Magnet link");
    expect(html).toContain(".torrent file");
    expect(html).toContain("Cancel");
  });

  it("returns the highest-risk warning from pasted file candidates", () => {
    const warning = getHighestRiskWarning("dataset.iso\nextras/run.ps1");

    expect(warning).toEqual({
      fileName: "run.ps1",
      level: "danger",
      reason: "Executable or script file. Only open it if you trust the source.",
    });
  });

  it("does not warn for magnet links without file candidates", () => {
    expect(getHighestRiskWarning("magnet:?xt=urn:btih:abc&dn=Legal")).toBeNull();
  });

  it("validates torrent file paths by extension", () => {
    expect(isTorrentFilePath("C:/Downloads/legal.torrent")).toBe(true);
    expect(isTorrentFilePath("C:/Downloads/legal.zip")).toBe(false);
  });

  it("rejects empty and invalid magnet input with helpful messages", () => {
    expect(validateMagnetUri("")).toEqual({
      ok: false,
      message: "Paste a magnet link before continuing.",
    });
    expect(validateMagnetUri("https://example.com/file.torrent")).toEqual({
      ok: false,
      message: "Magnet links must start with magnet:?.",
    });
    expect(validateMagnetUri("magnet:?dn=NoHash")).toEqual({
      ok: false,
      message: "Magnet links need an xt=urn:btih value.",
    });
  });

  it("creates a valid mock metadata preview with file list", () => {
    const validation = validateMagnetUri(
      "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=Legal+Dataset",
    );

    expect(validation.ok).toBe(true);
    if (!validation.ok) return;
    const preview = createMockMetadataPreview(validation);

    expect(preview.name).toBe("Legal Dataset");
    expect(preview.infoHash).toBe("0123456789abcdef0123456789abcdef01234567");
    expect(preview.files.map((file) => file.path)).toEqual([
      "Legal Dataset/Legal Dataset.iso",
      "Legal Dataset/README.txt",
      "Legal Dataset/SHA256SUMS",
    ]);
    expect(preview.sizeBytes).toBeGreaterThan(700_000_000);
  });
});
