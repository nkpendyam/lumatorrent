import { DownloadCloud } from "lucide-react";
import { Button, Card } from "@lumatorrent/ui";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="grid place-items-center p-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-[var(--lt-radius-xl)] bg-[var(--lt-accent-soft)] text-[var(--lt-accent-strong)]">
        <DownloadCloud size={28} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-[var(--lt-text-primary)]">No downloads yet</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--lt-text-secondary)]">
        Paste a magnet link or drop a .torrent file to begin. LumaTorrent is designed for legal
        files like Linux ISOs, open-source releases, public datasets, and Creative Commons media.
      </p>
      <Button className="mt-6" variant="primary" onClick={onAdd}>
        Add Torrent
      </Button>
    </Card>
  );
}
