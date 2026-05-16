const WINDOWS_RESERVED_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
]);

export type PathSafetyResult =
  | { ok: true; normalizedRelativePath: string }
  | { ok: false; reason: string };

export function validateTorrentRelativePath(input: string): PathSafetyResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, reason: "Path is empty." };
  if (input !== trimmed) {
    return { ok: false, reason: "Path cannot start or end with whitespace." };
  }

  const normalized = trimmed.replaceAll("\\", "/").normalize("NFC");

  if (normalized.startsWith("/") || /^[a-zA-Z]:\//.test(normalized)) {
    return { ok: false, reason: "Absolute paths are not allowed." };
  }

  const parts = normalized.split("/");
  for (const part of parts) {
    if (!part || part === "." || part === "..") {
      return { ok: false, reason: "Path traversal or empty path segment detected." };
    }
    if (part.endsWith(" ") || part.endsWith(".")) {
      return { ok: false, reason: "Filename cannot end with a space or dot." };
    }
    const base = part.split(".")[0]?.toUpperCase() ?? "";
    if (WINDOWS_RESERVED_NAMES.has(base)) {
      return { ok: false, reason: `Reserved Windows filename detected: ${base}.` };
    }
    if (part.length > 240) {
      return { ok: false, reason: "Filename segment is too long." };
    }
  }

  if (normalized.length > 1024) return { ok: false, reason: "Path is too long." };

  return { ok: true, normalizedRelativePath: normalized };
}

export function classifyFileRisk(path: string): "normal" | "executable" | "archive" | "unknown" {
  const lower = path.toLowerCase();
  if (/\.(exe|msi|bat|cmd|ps1|scr|vbs|js|jar|dmg|pkg|apk|sh|app)$/.test(lower)) {
    return "executable";
  }
  if (/\.(zip|rar|7z|tar|gz|bz2|xz)$/.test(lower)) return "archive";
  if (!lower.includes(".")) return "unknown";
  return "normal";
}
