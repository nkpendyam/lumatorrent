import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AddTorrentModal, getHighestRiskWarning, isTorrentFilePath } from "./AddTorrentModal";

describe("AddTorrentModal", () => {
  it("renders a warning for selected executable files", () => {
    const html = renderToStaticMarkup(
      <AddTorrentModal
        onAdd={vi.fn()}
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
    const html = renderToStaticMarkup(<AddTorrentModal onAdd={vi.fn()} onClose={vi.fn()} />);

    expect(html).toContain(".torrent file");
    expect(html).toContain("Browse");
    expect(html).toContain("Drop a .torrent file or paste its local path.");
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
});
