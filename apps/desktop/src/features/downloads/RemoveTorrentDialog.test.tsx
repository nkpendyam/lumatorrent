import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createMockDashboardTorrents } from "./mockEngine";
import { buildRemoveTorrentOptions, RemoveTorrentDialog } from "./RemoveTorrentDialog";

describe("RemoveTorrentDialog", () => {
  it("renders remove-only default copy with optional trash action", () => {
    const torrent = createMockDashboardTorrents()[0]!;

    const html = renderToStaticMarkup(
      <RemoveTorrentDialog torrent={torrent} onCancel={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(html).toContain('role="alertdialog"');
    expect(html).toContain("Remove download?");
    expect(html).toContain("Downloaded files stay on disk");
    expect(html).toContain("Move downloaded files to trash");
    expect(html).toContain("never performs permanent delete");
  });

  it("builds remove-only options by default", () => {
    expect(buildRemoveTorrentOptions(false)).toEqual({ deleteFiles: false });
  });

  it("builds trash-only delete options when requested", () => {
    expect(buildRemoveTorrentOptions(true)).toEqual({ deleteFiles: true, useTrash: true });
  });
});
