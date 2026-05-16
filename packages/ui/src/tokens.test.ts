import { describe, expect, it } from "vitest";

import { tokens } from "./tokens";

describe("tokens", () => {
  it("exposes stable design token groups", () => {
    expect(Object.keys(tokens)).toEqual([
      "color",
      "spacing",
      "radius",
      "typography",
      "motion",
      "shadow",
    ]);
  });

  it("keeps control motion inside the documented micro-transition range", () => {
    expect(tokens.motion.fast).toBeGreaterThanOrEqual(120);
    expect(tokens.motion.normal).toBeLessThanOrEqual(220);
  });
});
