import { motion } from "framer-motion";
import { Button, Card } from "@lumatorrent/ui";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/50 pt-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="w-[640px] overflow-hidden">
        <div className="border-b border-white/10 p-4">
          <input
            autoFocus
            className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
            placeholder="Type a command…"
            aria-label="Command search"
          />
        </div>
        <div className="p-2 text-sm text-slate-300">
          <div className="rounded-2xl px-3 py-2 hover:bg-white/5">Add torrent</div>
          <div className="rounded-2xl px-3 py-2 hover:bg-white/5">Run Download Doctor</div>
          <div className="rounded-2xl px-3 py-2 hover:bg-white/5">Open settings</div>
        </div>
        <div className="border-t border-white/10 p-3 text-right">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </motion.div>
  );
}
