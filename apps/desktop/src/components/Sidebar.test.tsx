import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("marks the active navigation item as the current page", () => {
    const html = renderToStaticMarkup(<Sidebar activeView="diagnostics" onViewChange={vi.fn()} />);

    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Diagnostics");
    expect(html).toContain('aria-label="Primary"');
  });

  it("exposes collapsed state for responsive shell behavior", () => {
    const html = renderToStaticMarkup(
      <Sidebar activeView="downloads" collapsed onViewChange={vi.fn()} />,
    );

    expect(html).toContain('data-collapsed="true"');
    expect(html).toContain('title="Downloads"');
  });
});
