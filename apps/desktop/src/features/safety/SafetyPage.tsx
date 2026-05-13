import { Card } from "@lumatorrent/ui";

const safeguards = [
  "Remove from app and delete files are separate actions.",
  "Path traversal and absolute torrent paths are rejected.",
  "Executable and script-like files get visible warnings.",
  "Remote dashboard remains disabled by default.",
  "Engine API binds to localhost and requires a token.",
];

export function SafetyPage() {
  return (
    <section className="min-h-0 flex-1 overflow-auto p-8">
      <h2 className="text-3xl font-semibold tracking-tight">Safety Center</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        LumaTorrent treats torrent metadata as untrusted input and makes destructive actions
        explicit.
      </p>
      <div className="mt-6 grid max-w-4xl gap-4">
        {safeguards.map((item) => (
          <Card key={item} className="p-5 text-sm text-slate-300">
            {item}
          </Card>
        ))}
      </div>
    </section>
  );
}
