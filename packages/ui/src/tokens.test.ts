import { describe, expect, it } from "vitest";

import { tokens } from "./tokens";
import { cn } from "./utils";

describe("@lumatorrent/ui", () => {
  it("exports stable design token groups", () => {
    expect(tokens.color.surface.canvas).toBe("var(--lt-surface-0)");
    expect(tokens.spacing.lg).toBe(16);
    expect(tokens.motion.normal).toBe(220);
  });

  it("merges utility classes predictably", () => {
    expect(cn("px-2", "px-4", false && "hidden")).toBe("px-4");
  });
});
