import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-[var(--lt-radius-card)] border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-2)] shadow-[var(--lt-shadow-soft)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
