import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders the title, subtitle, and primary shell controls", () => {
    const html = renderToStaticMarkup(
      <TopBar
        title="Downloads"
        subtitle="2 active"
        density="cards"
        themeMode="system"
        resolvedTheme="dark"
        onToggleDensity={vi.fn()}
        onToggleSidebar={vi.fn()}
        onToggleTheme={vi.fn()}
        onCommand={vi.fn()}
        onAdd={vi.fn()}
      />,
    );

    expect(html).toContain("Downloads");
    expect(html).toContain("2 active");
    expect(html).toContain("Table View");
    expect(html).toContain("Add Torrent");
  });

  it("labels the theme toggle with selected and resolved theme", () => {
    const html = renderToStaticMarkup(
      <TopBar
        title="Downloads"
        subtitle="2 active"
        density="table"
        themeMode="light"
        resolvedTheme="light"
        onToggleDensity={vi.fn()}
        onToggleSidebar={vi.fn()}
        onToggleTheme={vi.fn()}
        onCommand={vi.fn()}
        onAdd={vi.fn()}
      />,
    );

    expect(html).toContain('aria-label="Theme: Light (light)"');
    expect(html).toContain("Card View");
  });
});
