import { classifyFileRisk, type RiskLevel } from "@lumatorrent/shared";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export function AddTorrentModal({
  onClose,
  onAdd,
  onAddTorrentFile,
  selectedFileNames = [],
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
  onAddTorrentFile?: (torrentFilePath: string) => void;
  selectedFileNames?: string[];
}) {
  const [value, setValue] = useState("");
  const [torrentFilePath, setTorrentFilePath] = useState("");
  const riskWarning = getHighestRiskWarning(value, [...selectedFileNames, torrentFilePath]);
  const trimmedTorrentFilePath = torrentFilePath.trim();
  const hasTorrentFile = trimmedTorrentFilePath.length > 0;
  const torrentFileError =
    hasTorrentFile && !isTorrentFilePath(trimmedTorrentFilePath) ? "Choose a .torrent file." : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#111520] p-6 shadow-soft"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Add legal torrent</h2>
        <p className="mt-2 text-sm text-slate-400">
          Paste a magnet link or drop a .torrent file. LumaTorrent is designed for legal downloads
          only.
        </p>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="magnet:?xt=urn:btih:..."
          className="mt-6 h-32 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm outline-none ring-blue-500/40 placeholder:text-slate-600 focus:ring-4"
        />
        <div
          className="mt-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files.item(0);
            const droppedPath = getDroppedFilePath(file);
            if (droppedPath) setTorrentFilePath(droppedPath);
          }}
        >
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
            .torrent file
          </label>
          <input
            value={torrentFilePath}
            onChange={(event) => setTorrentFilePath(event.target.value)}
            placeholder="C:\\Downloads\\legal-release.torrent"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none ring-blue-500/40 placeholder:text-slate-600 focus:ring-4"
            aria-invalid={Boolean(torrentFileError)}
            aria-describedby={torrentFileError ? "torrent-file-error" : undefined}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
              Browse
              <input
                type="file"
                accept=".torrent"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.item(0);
                  const selectedPath = getDroppedFilePath(file);
                  if (selectedPath) setTorrentFilePath(selectedPath);
                }}
              />
            </label>
            <span className="text-xs text-slate-500">
              Drop a .torrent file or paste its local path.
            </span>
          </div>
          {torrentFileError ? (
            <p id="torrent-file-error" className="mt-3 text-sm text-red-200">
              {torrentFileError}
            </p>
          ) : null}
        </div>
        {riskWarning ? (
          <div
            className={`mt-4 flex gap-3 rounded-3xl border p-4 text-sm ${
              riskWarning.level === "danger"
                ? "border-red-400/30 bg-red-500/10 text-red-100"
                : "border-amber-300/30 bg-amber-400/10 text-amber-100"
            }`}
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">
                {riskWarning.level === "danger" ? "Potentially unsafe file" : "File needs review"}
              </p>
              <p className="mt-1 text-slate-200">
                {riskWarning.fileName}: {riskWarning.reason}
              </p>
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (hasTorrentFile) {
                if (!torrentFileError && onAddTorrentFile) onAddTorrentFile(trimmedTorrentFilePath);
                return;
              }
              onAdd(value.includes("magnet:") ? "Magnet download" : value.trim());
            }}
            disabled={Boolean(torrentFileError)}
            className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
          >
            {hasTorrentFile ? "Import Torrent" : "Start Download"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

type RiskWarning = {
  fileName: string;
  level: Exclude<RiskLevel, "safe">;
  reason: string;
};

const RISK_RANK: Record<RiskLevel, number> = {
  safe: 0,
  caution: 1,
  danger: 2,
};

export function getHighestRiskWarning(
  textInput: string,
  selectedFileNames: string[] = [],
): RiskWarning | null {
  const candidates = [...selectedFileNames, ...extractFileCandidates(textInput)];
  let highest: RiskWarning | null = null;

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

export function isTorrentFilePath(path: string): boolean {
  return basename(path).toLowerCase().endsWith(".torrent");
}

function getDroppedFilePath(file: File | null | undefined): string | null {
  if (!file) return null;
  const maybePath = file as File & { path?: string };
  return maybePath.path ?? file.name;
}
