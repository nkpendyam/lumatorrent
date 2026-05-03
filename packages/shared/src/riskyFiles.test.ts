import { describe, expect, it } from "vitest";
import { classifyFileRisk } from "./riskyFiles";

describe("classifyFileRisk", () => {
  it("marks executables as danger", () => {
    expect(classifyFileRisk("setup.exe").level).toBe("danger");
  });

  it("marks archives as caution", () => {
    expect(classifyFileRisk("dataset.zip").level).toBe("caution");
  });

  it("marks normal documents as safe", () => {
    expect(classifyFileRisk("readme.txt").level).toBe("safe");
  });
});
