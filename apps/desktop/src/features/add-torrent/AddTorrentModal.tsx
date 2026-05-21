import type { AddTorrentRequest } from "@lumatorrent/shared";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, Link2, Loader2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@lumatorrent/ui";
import { formatBytes } from "../../lib/format";
import {
  createMockMetadataPreview,
  createTorrentFileShellPreview,
  getHighestRiskWarning,
  isTorrentFilePath,
  validateMagnetUri,
  type MockTorrentMetadata,
} from "./addTorrentModel";

type AddTorrentModalProps = {
  onClose: () => void;
  onAddMagnet: (request: AddTorrentRequest) => Promise<void> | void;
  onAddTorrentFile?: (torrentFilePath: string) => Promise<void> | void;
  selectedFileNames?: string[];
};

type ImportMode = "magnet" | "file";
type MetadataState = "empty" | "invalid" | "loading" | "ready" | "adding" | "error";

export function AddTorrentModal({
  onClose,
  onAddMagnet,
  onAddTorrentFile,
  selectedFileNames = [],
}: AddTorrentModalProps) {
  const [mode, setMode] = useState<ImportMode>("magnet");
  const [magnetUri, setMagnetUri] = useState("");
  const [torrentFilePath, setTorrentFilePath] = useState("");
  const [metadataState, setMetadataState] = useState<MetadataState>("empty");
  const [message, setMessage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MockTorrentMetadata | null>(null);
  const magnetInputRef = useRef<HTMLTextAreaElement>(null);
  const cancelPreviewRef = useRef<number | null>(null);
  const trimmedTorrentFilePath = torrentFilePath.trim();
  const riskWarning = getHighestRiskWarning(magnetUri, [
    ...selectedFileNames,
    ...(metadata?.files.map((file) => file.path) ?? []),
    trimmedTorrentFilePath,
  ]);
  const canStart =
    (mode === "magnet" && metadataState === "ready" && metadata !== null) ||
    (mode === "file" &&
      trimmedTorrentFilePath.length > 0 &&
      isTorrentFilePath(trimmedTorrentFilePath));

  useEffect(() => {
    magnetInputRef.current?.focus();
    return () => {
      if (cancelPreviewRef.current) window.clearTimeout(cancelPreviewRef.current);
    };
  }, []);

  function resetPreview() {
    if (cancelPreviewRef.current) window.clearTimeout(cancelPreviewRef.current);
    setMetadata(null);
    setMessage(null);
    setMetadataState("empty");
  }

  function previewMagnet() {
    const validation = validateMagnetUri(magnetUri);
    if (!validation.ok) {
      setMetadata(null);
      setMessage(validation.message);
      setMetadataState("invalid");
      return;
    }

    setMetadata(null);
    setMessage("Fetching torrent information from the mock metadata service.");
    setMetadataState("loading");
    if (cancelPreviewRef.current) window.clearTimeout(cancelPreviewRef.current);
    cancelPreviewRef.current = window.setTimeout(() => {
      setMetadata(createMockMetadataPreview(validation));
      setMessage(null);
      setMetadataState("ready");
    }, 350);
  }

  async function startImport() {
    if (mode === "file") {
      if (!trimmedTorrentFilePath) {
        setMessage("Choose a .torrent file before importing.");
        setMetadataState("invalid");
        return;
      }
      if (!isTorrentFilePath(trimmedTorrentFilePath)) {
        setMessage("Choose a file ending in .torrent.");
        setMetadataState("invalid");
        return;
      }
      setMetadataState("adding");
      await onAddTorrentFile?.(trimmedTorrentFilePath);
      onClose();
      return;
    }

    const validation = validateMagnetUri(magnetUri);
    if (!validation.ok) {
      setMessage(validation.message);
      setMetadataState("invalid");
      return;
    }
    const preview = metadata ?? createMockMetadataPreview(validation);
    setMetadataState("adding");
    await onAddMagnet({
      magnetUri: validation.magnetUri,
      savePath: preview.savePath,
      selectedFiles: preview.files.map((file) => file.path),
    });
    onClose();
  }

  const fileShellPreview =
    mode === "file" && isTorrentFilePath(trimmedTorrentFilePath)
      ? createTorrentFileShellPreview(trimmedTorrentFilePath)
      : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-torrent-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-1)] p-5 text-[var(--lt-text-primary)] shadow-[var(--lt-shadow-soft)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lt-accent-strong)]">
              Legal torrent import
            </p>
            <h2 id="add-torrent-title" className="mt-1 text-2xl font-semibold tracking-tight">
              Add torrent
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lt-focus-ring rounded-[var(--lt-radius-control)] p-2 text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]"
            aria-label="Cancel add torrent"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-[var(--lt-radius-control)] bg-[var(--lt-surface-muted)] p-1">
          <ModeButton
            selected={mode === "magnet"}
            icon={<Link2 size={16} aria-hidden />}
            label="Magnet link"
            onClick={() => {
              setMode("magnet");
              resetPreview();
              window.setTimeout(() => magnetInputRef.current?.focus(), 0);
            }}
          />
          <ModeButton
            selected={mode === "file"}
            icon={<FileText size={16} aria-hidden />}
            label=".torrent file"
            onClick={() => {
              setMode("file");
              resetPreview();
            }}
          />
        </div>

        {mode === "magnet" ? (
          <section className="mt-5">
            <label
              htmlFor="magnet-uri"
              className="text-sm font-medium text-[var(--lt-text-primary)]"
            >
              Magnet link
            </label>
            <textarea
              id="magnet-uri"
              ref={magnetInputRef}
              value={magnetUri}
              onChange={(event) => {
                setMagnetUri(event.target.value);
                resetPreview();
              }}
              placeholder="magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=Ubuntu+Legal+ISO"
              className="lt-focus-ring mt-2 h-28 w-full resize-none rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-0)] p-4 text-sm text-[var(--lt-text-primary)] placeholder:text-[var(--lt-text-tertiary)]"
              aria-invalid={metadataState === "invalid"}
              aria-describedby={message ? "add-torrent-message" : undefined}
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <Button type="button" onClick={previewMagnet} disabled={metadataState === "loading"}>
                {metadataState === "loading" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : (
                  <Link2 size={16} aria-hidden />
                )}
                <span className="ml-2">Preview metadata</span>
              </Button>
              <p className="self-center text-sm text-[var(--lt-text-secondary)]">
                LumaTorrent never adds clipboard content automatically.
              </p>
            </div>
          </section>
        ) : (
          <section
            className="mt-5 rounded-[var(--lt-radius-card)] border border-dashed border-[var(--lt-border-subtle)] bg-[var(--lt-surface-0)] p-5"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files.item(0);
              const droppedPath = getDroppedFilePath(file);
              if (droppedPath) setTorrentFilePath(droppedPath);
            }}
          >
            <label
              htmlFor="torrent-file-path"
              className="text-sm font-medium text-[var(--lt-text-primary)]"
            >
              .torrent file path
            </label>
            <input
              id="torrent-file-path"
              value={torrentFilePath}
              onChange={(event) => setTorrentFilePath(event.target.value)}
              placeholder="C:\\Downloads\\legal-release.torrent"
              className="lt-focus-ring mt-2 w-full rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-1)] px-4 py-3 text-sm text-[var(--lt-text-primary)] placeholder:text-[var(--lt-text-tertiary)]"
              aria-invalid={Boolean(
                trimmedTorrentFilePath && !isTorrentFilePath(trimmedTorrentFilePath),
              )}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="lt-focus-ring inline-flex cursor-pointer items-center rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] px-4 py-2 text-sm font-medium hover:bg-[var(--lt-surface-muted)]">
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
              <span className="text-sm text-[var(--lt-text-secondary)]">
                Drop a `.torrent` file here or paste a local path.
              </span>
            </div>
            {trimmedTorrentFilePath && !isTorrentFilePath(trimmedTorrentFilePath) ? (
              <InlineMessage tone="danger" message="Choose a file ending in .torrent." />
            ) : null}
          </section>
        )}

        {message ? <InlineMessage id="add-torrent-message" tone="info" message={message} /> : null}
        {metadataState === "loading" ? (
          <div
            className="mt-4 rounded-[var(--lt-radius-card)] border border-[var(--lt-status-info-border)] bg-[var(--lt-status-info-bg)] p-4 text-sm text-[var(--lt-status-info-text)]"
            role="status"
          >
            Fetching torrent information from mock metadata.
          </div>
        ) : null}
        {riskWarning ? (
          <div
            className={`mt-4 flex gap-3 rounded-[var(--lt-radius-card)] border p-4 text-sm ${
              riskWarning.level === "danger"
                ? "border-[var(--lt-status-danger-border)] bg-[var(--lt-status-danger-bg)] text-[var(--lt-status-danger-text)]"
                : "border-[var(--lt-status-warning-border)] bg-[var(--lt-status-warning-bg)] text-[var(--lt-status-warning-text)]"
            }`}
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">
                {riskWarning.level === "danger" ? "Potentially unsafe file" : "File needs review"}
              </p>
              <p className="mt-1">
                {riskWarning.fileName}: {riskWarning.reason}
              </p>
            </div>
          </div>
        ) : null}
        {metadata ? <MetadataPreview metadata={metadata} /> : null}
        {fileShellPreview ? <MetadataPreview metadata={fileShellPreview} shell /> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={startImport} disabled={!canStart}>
            {metadataState === "adding" ? (
              <Loader2 size={16} className="animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 size={16} aria-hidden />
            )}
            <span className="ml-2">{mode === "file" ? "Import torrent" : "Start mock add"}</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModeButton({
  selected,
  icon,
  label,
  onClick,
}: {
  selected: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`lt-focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--lt-radius-control)] px-3 py-2 text-sm font-medium ${
        selected
          ? "bg-[var(--lt-surface-0)] text-[var(--lt-text-primary)] shadow-[var(--lt-shadow-soft)]"
          : "text-[var(--lt-text-secondary)] hover:text-[var(--lt-text-primary)]"
      }`}
      aria-pressed={selected}
    >
      {icon}
      {label}
    </button>
  );
}

function MetadataPreview({
  metadata,
  shell = false,
}: {
  metadata: MockTorrentMetadata;
  shell?: boolean;
}) {
  return (
    <section className="mt-4 rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--lt-text-tertiary)]">
            {shell ? "Import shell" : "Mock metadata preview"}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{metadata.name}</h3>
          <p className="mt-1 text-sm text-[var(--lt-text-secondary)]">
            {shell
              ? "The engine will parse this local .torrent file when import starts."
              : `Info hash ${metadata.infoHash}`}
          </p>
        </div>
        <div className="rounded-[var(--lt-radius-control)] bg-[var(--lt-surface-muted)] px-3 py-2 text-sm text-[var(--lt-text-secondary)]">
          {metadata.sizeBytes > 0 ? formatBytes(metadata.sizeBytes) : "Size pending"}
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-[var(--lt-text-tertiary)]">
          <span>File list preview</span>
          <span>{metadata.files.length} files</span>
        </div>
        <ul className="divide-y divide-[var(--lt-border-subtle)] rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)]">
          {metadata.files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="min-w-0 truncate text-[var(--lt-text-primary)]">{file.path}</span>
              <span className="shrink-0 text-[var(--lt-text-secondary)]">
                {file.sizeBytes > 0 ? formatBytes(file.sizeBytes) : "pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-sm text-[var(--lt-text-secondary)]">
        Save location: {metadata.savePath}
      </p>
    </section>
  );
}

function InlineMessage({
  id,
  tone,
  message,
}: {
  id?: string;
  tone: "info" | "danger";
  message: string;
}) {
  return (
    <p
      id={id}
      className={`mt-3 rounded-[var(--lt-radius-control)] px-3 py-2 text-sm ${
        tone === "danger"
          ? "bg-[var(--lt-status-danger-bg)] text-[var(--lt-status-danger-text)]"
          : "bg-[var(--lt-status-info-bg)] text-[var(--lt-status-info-text)]"
      }`}
      role={tone === "danger" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}

function getDroppedFilePath(file: File | null | undefined): string | null {
  if (!file) return null;
  const maybePath = file as File & { path?: string };
  return maybePath.path ?? file.name;
}
