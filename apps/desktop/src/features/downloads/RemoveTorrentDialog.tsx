import type { RemoveTorrentOptions, TorrentSummary } from "@lumatorrent/shared";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@lumatorrent/ui";
import { formatBytes } from "../../lib/format";

export function RemoveTorrentDialog({
  torrent,
  errorMessage,
  onCancel,
  onConfirm,
}: {
  torrent: TorrentSummary;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: (options: RemoveTorrentOptions) => void;
}) {
  const [deleteFiles, setDeleteFiles] = useState(false);
  const files = torrent.files ?? [];
  const previewFiles = files.slice(0, 4);
  const remainingFileCount = Math.max(0, files.length - previewFiles.length);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur-sm">
      <section
        className="w-full max-w-lg rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-1)] p-6 shadow-[var(--lt-shadow-soft)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-torrent-title"
        aria-describedby="remove-torrent-description"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--lt-radius-lg)] bg-[var(--lt-status-warning-bg)] text-[var(--lt-status-warning-text)]">
            <AlertTriangle size={20} aria-hidden />
          </div>
          <div>
            <h2 id="remove-torrent-title" className="text-lg font-semibold">
              Remove download?
            </h2>
            <p
              id="remove-torrent-description"
              className="mt-2 text-sm text-[var(--lt-text-secondary)]"
            >
              {torrent.name} will be removed from LumaTorrent. Downloaded files stay on disk unless
              you choose to move them to the operating-system trash.
            </p>
          </div>
        </div>

        <label className="mt-5 flex items-start gap-3 rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-muted)] p-4 text-sm text-[var(--lt-text-primary)]">
          <input
            className="mt-1 h-4 w-4 accent-[var(--lt-accent)]"
            type="checkbox"
            checked={deleteFiles}
            onChange={(event) => setDeleteFiles(event.target.checked)}
          />
          <span>
            <span className="flex items-center gap-2 font-medium">
              <Trash2 size={16} aria-hidden />
              Move downloaded files to trash
            </span>
            <span className="mt-1 block text-[var(--lt-text-secondary)]">
              LumaTorrent never performs permanent delete from this action.
            </span>
          </span>
        </label>

        {deleteFiles && files.length > 0 ? (
          <div className="mt-4 rounded-[var(--lt-radius-control)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-muted)] p-4">
            <div className="text-sm font-medium">
              {files.length} file{files.length === 1 ? "" : "s"} queued for trash
            </div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--lt-text-secondary)]">
              {previewFiles.map((file) => (
                <li className="flex min-w-0 justify-between gap-3" key={file.id}>
                  <span className="truncate">{file.path}</span>
                  <span className="shrink-0 tabular-nums">{formatBytes(file.sizeBytes)}</span>
                </li>
              ))}
            </ul>
            {remainingFileCount > 0 ? (
              <div className="mt-2 text-sm text-[var(--lt-text-secondary)]">
                +{remainingFileCount} more
              </div>
            ) : null}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 rounded-[var(--lt-radius-control)] border border-[var(--lt-status-danger-border)] bg-[var(--lt-status-danger-bg)] p-3 text-sm text-[var(--lt-status-danger-text)]">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(buildRemoveTorrentOptions(deleteFiles))}
          >
            Remove
          </Button>
        </div>
      </section>
    </div>
  );
}

export function buildRemoveTorrentOptions(deleteFiles: boolean): RemoveTorrentOptions {
  return deleteFiles ? { deleteFiles: true, useTrash: true } : { deleteFiles: false };
}
