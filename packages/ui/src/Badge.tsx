import type { ReactNode } from "react";

const tones = {
  neutral: "bg-[var(--lt-surface-muted)] text-[var(--lt-text-secondary)]",
  success:
    "border border-[var(--lt-status-success-border)] bg-[var(--lt-status-success-bg)] text-[var(--lt-status-success-text)]",
  warning:
    "border border-[var(--lt-status-warning-border)] bg-[var(--lt-status-warning-bg)] text-[var(--lt-status-warning-text)]",
  danger:
    "border border-[var(--lt-status-danger-border)] bg-[var(--lt-status-danger-bg)] text-[var(--lt-status-danger-text)]",
  info: "border border-[var(--lt-status-info-border)] bg-[var(--lt-status-info-bg)] text-[var(--lt-status-info-text)]",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-[var(--lt-radius-pill)] px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
