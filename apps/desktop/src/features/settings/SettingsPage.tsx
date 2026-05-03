import { Card } from "@lumatorrent/ui";

const sections = [
  ["General", "Startup, tray behavior, default actions"],
  ["Downloads", "Save paths, file selection, queue defaults"],
  ["Speed", "Smart limits, scheduling, active torrent counts"],
  ["Network", "Port, DHT, PEX, proxy, encryption"],
  ["Privacy & Safety", "Risk warnings, safe delete, logs, crash reports"],
  ["Appearance", "Theme, density, reduce motion, accent"],
  ["Advanced", "Expert mode, engine logs, database repair"],
];

export function SettingsPage() {
  return (
    <section className="min-h-0 flex-1 overflow-auto p-8">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-wide text-blue-300">Settings architecture</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Simple first, expert when needed.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Settings are grouped by user intent. Advanced protocol controls stay available without overwhelming first-run users.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {sections.map(([title, description]) => (
            <Card key={title} className="p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
