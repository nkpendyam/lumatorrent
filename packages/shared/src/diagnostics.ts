import type { DiagnosticCause, Recommendation, SpeedDiagnostic, TorrentSummary } from "./types";

export function diagnoseTorrent(torrent: TorrentSummary): SpeedDiagnostic {
  const causes: DiagnosticCause[] = [];
  const recommendations: Recommendation[] = [];

  if (torrent.status === "metadata") {
    causes.push({
      code: "FETCHING_METADATA",
      severity: "info",
      title: "Fetching torrent information",
      message: "The app is still finding metadata for this magnet link.",
    });
  }

  if (torrent.seeders === 0 && torrent.status !== "metadata") {
    causes.push({
      code: "NO_SEEDERS",
      severity: "critical",
      title: "No seeders found",
      message: "This torrent may be inactive. Downloads cannot complete without available pieces from seeders or peers.",
    });
    recommendations.push({
      id: "wait-or-remove",
      label: "Keep waiting or remove it",
      description: "If no seeders appear after some time, the torrent may be dead.",
    });
  } else if (torrent.seeders > 0 && torrent.seeders < 3) {
    causes.push({
      code: "LOW_SEEDERS",
      severity: "warning",
      title: "Weak availability",
      message: "Only a few seeders are available, so speed may be limited.",
    });
  }

  if (torrent.downloadSpeedBytes < 50_000 && torrent.progress < 0.98 && torrent.status === "downloading") {
    recommendations.push({
      id: "run-port-check",
      label: "Check incoming port",
      description: "A closed port can reduce the number of peers that can connect to you.",
      action: "check-port",
    });
    recommendations.push({
      id: "refresh-trackers",
      label: "Refresh trackers",
      description: "Ask trackers for fresh peer information.",
      action: "refresh-trackers",
    });
  }

  const summary = causes.some((cause) => cause.severity === "critical")
    ? "This download has a critical availability problem."
    : causes.length > 0
      ? "This download has a few possible speed limitations."
      : "No major issues detected right now.";

  return {
    torrentId: torrent.id,
    summary,
    causes,
    recommendations,
    generatedAtIso: new Date().toISOString(),
  };
}
