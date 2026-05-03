import { Card } from "@lumatorrent/ui";

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--lt-text-tertiary)]">{label}</div>
      <div className="mt-2 text-xl font-semibold text-[var(--lt-text-primary)]">{value}</div>
      {detail ? <p className="mt-1 text-xs text-[var(--lt-text-tertiary)]">{detail}</p> : null}
    </Card>
  );
}
