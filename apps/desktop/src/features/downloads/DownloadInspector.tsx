import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { TorrentSummary } from "@lumatorrent/shared";
import { Button, Card } from "@lumatorrent/ui";
import { formatBytes, formatSpeed } from "../../lib/format";

export function DownloadInspector({
  torrent,
  onClose,
  onRemoveRequest,
}: {
  torrent: TorrentSummary;
  onClose: () => void;
  onRemoveRequest?: () => void;
}) {
  return (
    <motion.aside
      className="fixed right-0 top-0 z-40 h-screen w-[440px] border-l border-white/10 bg-[#0d1118]/95 p-6 shadow-2xl backdrop-blur-2xl"
      initial={{ x: 440, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 440, opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      aria-label="Download details"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-300">Inspector</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{torrent.name}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {Math.round(torrent.progress * 100)}% complete · {torrent.status}
          </p>
        </div>
        <button
          className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          onClick={onClose}
          aria-label="Close inspector"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-xs text-slate-500">Download</div>
          <div className="mt-1 font-semibold">{formatSpeed(torrent.downloadSpeedBytes)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Upload</div>
          <div className="mt-1 font-semibold">{formatSpeed(torrent.uploadSpeedBytes)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Size</div>
          <div className="mt-1 font-semibold">{formatBytes(torrent.sizeBytes)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Health</div>
          <div className="mt-1 font-semibold capitalize">{torrent.health}</div>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h3 className="font-semibold">Senior UX note</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This inspector is intentionally calm by default. Trackers, peers, DHT, and piece details
          belong in expert tabs, not the first visual layer.
        </p>
      </Card>
      <div className="mt-6 flex gap-3">
        <Button variant="primary">Diagnose</Button>
        <Button>Reveal folder</Button>
        {onRemoveRequest ? (
          <Button variant="danger" onClick={onRemoveRequest}>
            Remove
          </Button>
        ) : null}
      </div>
    </motion.aside>
  );
}
