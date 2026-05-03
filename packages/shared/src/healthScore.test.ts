import { describe, expect, it } from "vitest";
import { calculateHealthScore } from "./healthScore";

describe("calculateHealthScore", () => {
  it("does not overstate dead torrents", () => {
    const result = calculateHealthScore({ health: "dead", downloadSpeedBytes: 0, progress: 0, status: "downloading" });
    expect(result.label).toBe("dead");
    expect(result.score).toBeLessThan(20);
  });

  it("rewards healthy active downloads", () => {
    const result = calculateHealthScore({ health: "excellent", downloadSpeedBytes: 5_000_000, progress: 0.5, status: "downloading" });
    expect(result.label).toBe("excellent");
  });
});
