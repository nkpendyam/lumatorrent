import { motion } from "framer-motion";
import { useState } from "react";

export function AddTorrentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");
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
          Paste a magnet link or drop a .torrent file. LumaTorrent is designed for legal downloads only.
        </p>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="magnet:?xt=urn:btih:..."
          className="mt-6 h-32 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm outline-none ring-blue-500/40 placeholder:text-slate-600 focus:ring-4"
        />
        <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
          Drop .torrent file here
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
            Cancel
          </button>
          <button
            onClick={() => onAdd(value.includes("magnet:") ? "Magnet download" : value.trim())}
            className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
          >
            Start Download
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
