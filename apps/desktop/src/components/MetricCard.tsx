import type { ReactNode } from "react";
import { Card } from "@lumatorrent/ui";

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[var(--lt-text-tertiary)]">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--lt-text-primary)]">
            {value}
          </div>
        </div>
        {icon ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--lt-radius-lg)] bg-[var(--lt-surface-muted)] text-[var(--lt-accent-strong)]">
            {icon}
          </div>
        ) : null}
      </div>
      {detail ? (
        <p className="mt-3 text-xs leading-5 text-[var(--lt-text-tertiary)]">{detail}</p>
      ) : null}
    </Card>
  );
}
