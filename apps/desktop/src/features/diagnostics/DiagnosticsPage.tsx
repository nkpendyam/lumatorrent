import { Card } from "@lumatorrent/ui";

export function DiagnosticsPage() {
  return (
    <section className="min-h-0 flex-1 overflow-auto p-8">
      <h2 className="text-3xl font-semibold tracking-tight">Diagnostics</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        Download Doctor separates fixable local issues from torrent availability limits. This page will become the global health control center.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card className="p-5"><h3 className="font-semibold">Port status</h3><p className="mt-2 text-sm text-slate-400">Future real check with confidence level.</p></Card>
        <Card className="p-5"><h3 className="font-semibold">DHT status</h3><p className="mt-2 text-sm text-slate-400">Future DHT bootstrap and node visibility.</p></Card>
        <Card className="p-5"><h3 className="font-semibold">Disk health</h3><p className="mt-2 text-sm text-slate-400">Future write speed and free space monitoring.</p></Card>
      </div>
    </section>
  );
}
