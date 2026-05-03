import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--lt-accent)] text-[var(--lt-text-inverse)] hover:bg-[var(--lt-accent-strong)]",
  secondary:
    "border border-[var(--lt-border-subtle)] bg-[var(--lt-surface-muted)] text-[var(--lt-text-primary)] hover:border-[var(--lt-border-strong)]",
  danger: "bg-[var(--lt-status-danger-text)] text-[var(--lt-text-inverse)] hover:brightness-110",
  ghost:
    "text-[var(--lt-text-secondary)] hover:bg-[var(--lt-surface-muted)] hover:text-[var(--lt-text-primary)]",
};

export function Button({
  variant = "secondary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; children: ReactNode }) {
  return (
    <button
      className={`lt-focus-ring inline-flex items-center justify-center rounded-[var(--lt-radius-control)] px-4 py-2 text-sm font-medium transition duration-[var(--lt-duration-fast)] ease-[var(--lt-ease-standard)] disabled:cursor-not-allowed disabled:opacity-[0.48] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
