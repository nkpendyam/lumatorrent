import { describe, expect, it } from "vitest";
import pathSafetyCases from "../../../tests/fixtures/path-safety-cases.json";
import { classifyFileRisk, validateTorrentRelativePath } from "./pathSafety";

const cases = pathSafetyCases as {
  valid: string[];
  invalid: string[];
  riskyFiles: string[];
};

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

  it("accepts all valid path safety fixtures", () => {
    for (const fixture of cases.valid) {
      expect(validateTorrentRelativePath(fixture), fixture).toMatchObject({ ok: true });
    }
  });

  it("rejects all malicious path safety fixtures", () => {
    for (const fixture of cases.invalid) {
      expect(validateTorrentRelativePath(fixture), fixture).toMatchObject({ ok: false });
    }
  });
});

describe("classifyFileRisk", () => {
  it("detects executables", () => {
    expect(classifyFileRisk("setup.exe")).toBe("executable");
  });

  it("detects archives", () => {
    expect(classifyFileRisk("dataset.zip")).toBe("archive");
  });

  it("flags risky file fixtures as executable or archive", () => {
    for (const fixture of cases.riskyFiles) {
      expect(classifyFileRisk(fixture), fixture).not.toBe("normal");
    }
  });
});
