import { describe, expect, it } from "vitest";
import { formatBytes, formatEta } from "./format";

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(1024)).toContain("KB");
  });
});

describe("formatEta", () => {
  it("formats minutes", () => {
    expect(formatEta(120)).toBe("2 min left");
  });
});
