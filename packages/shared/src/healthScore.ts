import type { TorrentSummary } from "./types";

export type HealthScoreResult = {
  score: number;
  label: "excellent" | "good" | "weak" | "dead";
  confidence: "low" | "medium" | "high";
  reasons: string[];
};

export function calculateHealthScore(torrent: Pick<TorrentSummary, "health" | "downloadSpeedBytes" | "progress" | "status">): HealthScoreResult {
  const reasons: string[] = [];
  let score = 50;
  if (torrent.health === "excellent") score += 35;
  if (torrent.health === "good") score += 20;
  if (torrent.health === "weak") score -= 15;
  if (torrent.health === "dead") score -= 45;
  if (torrent.downloadSpeedBytes > 2_000_000) { score += 10; reasons.push("active transfer observed"); }
  if (torrent.downloadSpeedBytes === 0 && torrent.status === "downloading") { score -= 15; reasons.push("no current transfer while downloading"); }
  if (torrent.progress > 0.95) score += 5;
  const bounded = Math.max(0, Math.min(100, score));
  const label = bounded >= 80 ? "excellent" : bounded >= 55 ? "good" : bounded >= 20 ? "weak" : "dead";
  return { score: bounded, label, confidence: reasons.length > 0 ? "medium" : "low", reasons };
}
