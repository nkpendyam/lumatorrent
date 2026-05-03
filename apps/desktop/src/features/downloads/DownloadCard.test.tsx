import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DownloadCard } from "./DownloadCard";
import { createMockDashboardTorrents } from "./mockEngine";

describe("DownloadCard", () => {
  it("renders accessible status and health labels", () => {
    const torrent = createMockDashboardTorrents().find((item) => item.status === "metadata");

    const html = renderToStaticMarkup(
      <DownloadCard torrent={torrent!} onDiagnose={vi.fn()} onOpenDetails={vi.fn()} />,
    );

    expect(html).toContain("Status: Finding peers...");
    expect(html).toContain("Health: Checking availability");
  });

  it("renders attention copy for weak availability", () => {
    const torrent = createMockDashboardTorrents().find((item) => item.health === "weak");

    const html = renderToStaticMarkup(
      <DownloadCard torrent={torrent!} onDiagnose={vi.fn()} onOpenDetails={vi.fn()} />,
    );

    expect(html).toContain("Health: Weak availability");
    expect(html).toContain("Waiting for seeders");
  });
});
