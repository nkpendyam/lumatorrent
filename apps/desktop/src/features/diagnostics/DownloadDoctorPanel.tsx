import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { SpeedDiagnostic } from "@lumatorrent/shared";

export function DownloadDoctorPanel({
  diagnostic,
  onClose,
}: {
  diagnostic: SpeedDiagnostic;
  onClose: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 240 }}
      className="fixed right-0 top-0 z-50 h-screen w-[420px] border-l border-white/10 bg-[#0f131d] p-6 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Download Doctor</h2>
          <p className="text-sm text-slate-400">Human-readable speed diagnosis</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 hover:bg-white/10"
          aria-label="Close diagnostics"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
        {diagnostic.summary}
      </div>

      <div className="mt-6 space-y-3">
        {diagnostic.causes.length === 0 ? (
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            No major issues detected. If speed is still low, the seeders may simply be slow.
          </div>
        ) : (
          diagnostic.causes.map((cause) => (
            <div
              key={cause.code}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="font-medium">{cause.title}</div>
              <p className="mt-1 text-sm leading-6 text-slate-400">{cause.message}</p>
            </div>
          ))
        )}
      </div>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Recommended actions
      </h3>
      <div className="mt-3 space-y-3">
        {diagnostic.recommendations.map((item) => (
          <button
            key={item.id}
            className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left hover:bg-white/[0.07]"
          >
            <div className="font-medium">{item.label}</div>
            <p className="mt-1 text-sm text-slate-400">{item.description}</p>
          </button>
        ))}
      </div>
    </motion.aside>
  );
}
