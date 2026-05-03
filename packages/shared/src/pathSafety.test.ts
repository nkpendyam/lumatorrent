import { describe, expect, it } from "vitest";
import { classifyFileRisk, validateTorrentRelativePath } from "./pathSafety";

describe("validateTorrentRelativePath", () => {
  it("accepts normal relative paths", () => {
    expect(validateTorrentRelativePath("folder/file.iso").ok).toBe(true);
  });

  it("rejects traversal", () => {
    expect(validateTorrentRelativePath("../secret.txt").ok).toBe(false);
  });

  it("rejects absolute unix paths", () => {
    expect(validateTorrentRelativePath("/etc/passwd").ok).toBe(false);
  });

  it("rejects absolute windows paths", () => {
    expect(validateTorrentRelativePath("C:\\Users\\file.txt").ok).toBe(false);
  });

  it("rejects windows reserved names", () => {
    expect(validateTorrentRelativePath("CON.txt").ok).toBe(false);
  });
});

describe("classifyFileRisk", () => {
  it("detects executables", () => {
    expect(classifyFileRisk("setup.exe")).toBe("executable");
  });

  it("detects archives", () => {
    expect(classifyFileRisk("dataset.zip")).toBe("archive");
  });
});
