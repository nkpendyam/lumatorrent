import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.045] shadow-soft backdrop-blur-xl ${className}`} {...props}>
      {children}
    </div>
  );
}
