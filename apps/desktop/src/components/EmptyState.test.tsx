import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders custom filtered-empty copy", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        title="No downloads match that search"
        description="Try a different legal download name."
        actionLabel="Clear filters"
        onAdd={vi.fn()}
      />,
    );

    expect(html).toContain("No downloads match that search");
    expect(html).toContain("Try a different legal download name.");
    expect(html).toContain("Clear filters");
  });
});
