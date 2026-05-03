/**
 * Contract placeholder that validates the expected shape of Engine API examples.
 * Replace with real mock-server tests once the engine server implementation is active.
 */
const requiredTorrentFields = [
  "id", "name", "status", "progress", "downloadSpeed", "uploadSpeed", "etaSeconds", "health"
];

const example = {
  id: "fixture-ubuntu",
  name: "Ubuntu ISO Fixture",
  status: "downloading",
  progress: 0.42,
  downloadSpeed: 1200000,
  uploadSpeed: 200000,
  etaSeconds: 600,
  health: "good"
};

for (const field of requiredTorrentFields) {
  if (!(field in example)) {
    console.error(`Missing required torrent field: ${field}`);
    process.exit(1);
  }
}

console.log("Engine contract placeholder OK");
