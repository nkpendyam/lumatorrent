import { classifyFileRisk, type TorrentFile } from "@lumatorrent/shared";

export type MagnetValidationResult =
  | {
      ok: true;
      magnetUri: string;
      infoHash: string;
      displayName: string;
    }
  | {
      ok: false;
      message: string;
    };

export type MockTorrentMetadata = {
  name: string;
  infoHash: string;
  sizeBytes: number;
  files: TorrentFile[];
  savePath: string;
};

const DEFAULT_SAVE_PATH = "~/Downloads/LumaTorrent";

export function validateMagnetUri(input: string): MagnetValidationResult {
  const magnetUri = input.trim();
  if (!magnetUri) {
    return { ok: false, message: "Paste a magnet link before continuing." };
  }
  if (!magnetUri.toLowerCase().startsWith("magnet:?")) {
    return { ok: false, message: "Magnet links must start with magnet:?." };
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(magnetUri.slice("magnet:?".length));
  } catch {
    return { ok: false, message: "This magnet link could not be read." };
  }

  const infoHash = params
    .getAll("xt")
    .map((value) => value.match(/^urn:btih:([a-z0-9]+)$/i)?.[1] ?? null)
    .find((value): value is string => Boolean(value));
  if (!infoHash) {
    return { ok: false, message: "Magnet links need an xt=urn:btih value." };
  }
  if (!isSupportedBtih(infoHash)) {
    return { ok: false, message: "The magnet info hash must be a valid BTIH value." };
  }

  return {
    ok: true,
    magnetUri,
    infoHash: infoHash.toLowerCase(),
    displayName: normalizeDisplayName(params.get("dn")) ?? "Legal torrent metadata",
  };
}

export function createMockMetadataPreview(
  validation: Extract<MagnetValidationResult, { ok: true }>,
): MockTorrentMetadata {
  const rootName = sanitizePathSegment(validation.displayName);
  const seed = hashSeed(validation.infoHash);
  const mediaSize = 700_000_000 + seed * 37_000;
  const docsSize = 48_000 + seed * 19;
  const checksumSize = 4_096;

  const files: TorrentFile[] = [
    createPreviewFile("file-0", `${rootName}/${rootName}.iso`, mediaSize),
    createPreviewFile("file-1", `${rootName}/README.txt`, docsSize),
    createPreviewFile("file-2", `${rootName}/SHA256SUMS`, checksumSize),
  ];

  return {
    name: validation.displayName,
    infoHash: validation.infoHash,
    sizeBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
    files,
    savePath: DEFAULT_SAVE_PATH,
  };
}

export function createTorrentFileShellPreview(torrentFilePath: string): MockTorrentMetadata {
  const name = basename(torrentFilePath).replace(/\.torrent$/i, "") || "Torrent file";
  const rootName = sanitizePathSegment(name);
  const files = [
    createPreviewFile("file-0", `${rootName}/metadata will be parsed by engine.txt`, 0),
  ];

  return {
    name,
    infoHash: "pending metadata parse",
    sizeBytes: 0,
    files,
    savePath: DEFAULT_SAVE_PATH,
  };
}

export function isTorrentFilePath(path: string): boolean {
  return basename(path).toLowerCase().endsWith(".torrent");
}

export function getHighestRiskWarning(
  textInput: string,
  selectedFileNames: string[] = [],
): {
  fileName: string;
  level: "caution" | "danger";
  reason: string;
} | null {
  const candidates = [...selectedFileNames, ...extractFileCandidates(textInput)];
  let highest: { fileName: string; level: "caution" | "danger"; reason: string } | null = null;

  for (const candidate of candidates) {
    const fileName = basename(candidate);
    const risk = classifyFileRisk(fileName);
    if (risk.level === "safe") continue;

    if (!highest || RISK_RANK[risk.level] > RISK_RANK[highest.level]) {
      highest = {
        fileName,
        level: risk.level,
        reason: risk.reason,
      };
    }
  }

  return highest;
}

const RISK_RANK = {
  caution: 1,
  danger: 2,
} as const;

function isSupportedBtih(value: string): boolean {
  return /^[a-f0-9]{40}$/i.test(value) || /^[a-z2-7]{32}$/i.test(value);
}

function normalizeDisplayName(value: string | null): string | null {
  const normalized = value?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : null;
}

function createPreviewFile(id: string, path: string, sizeBytes: number): TorrentFile {
  return {
    id,
    path,
    sizeBytes,
    progress: 0,
    priority: "normal",
    risk: classifyFileRisk(path).level === "danger" ? "executable" : "normal",
  };
}

function hashSeed(infoHash: string): number {
  return Array.from(infoHash).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function sanitizePathSegment(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function extractFileCandidates(textInput: string): string[] {
  return textInput
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item) => !item.toLowerCase().startsWith("magnet:"))
    .filter((item) => basename(item).includes("."));
}

function basename(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}
