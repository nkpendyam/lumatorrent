export type RiskLevel = "safe" | "caution" | "danger";

const DANGEROUS_EXTENSIONS = new Set([
  ".exe",
  ".msi",
  ".bat",
  ".cmd",
  ".ps1",
  ".scr",
  ".vbs",
  ".js",
  ".jar",
  ".apk",
  ".dmg",
  ".pkg",
  ".app",
]);

const CAUTION_EXTENSIONS = new Set([".zip", ".rar", ".7z", ".tar", ".gz", ".iso"]);

export function classifyFileRisk(fileName: string): { level: RiskLevel; reason: string } {
  const lower = fileName.trim().toLowerCase();
  const ext = lower.includes(".") ? lower.slice(lower.lastIndexOf(".")) : "";
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      level: "danger",
      reason: "Executable or script file. Only open it if you trust the source.",
    };
  }
  if (CAUTION_EXTENSIONS.has(ext)) {
    return { level: "caution", reason: "Archive or disk image. Inspect contents before opening." };
  }
  return { level: "safe", reason: "No obvious executable risk detected." };
}
