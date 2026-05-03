import type { ReactNode } from "react";

const tones = {
  neutral: "bg-white/10 text-slate-200",
  success: "bg-emerald-400/15 text-emerald-200",
  warning: "bg-amber-400/15 text-amber-200",
  danger: "bg-red-400/15 text-red-200",
  info: "bg-blue-400/15 text-blue-200"
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
