const nodes = [
  ["M0", "preflight and dependency install", []],
  ["M1", "design tokens and app shell", ["M0"]],
  ["M2", "settings persistence", ["M1"]],
  ["M3", "engine contract validation", ["M0"]],
  ["M4", "sidecar spawn and auth", ["M3"]],
  ["M5", "native engine health endpoint", ["M4"]],
  ["M6", "libtorrent async session skeleton", ["M5"]],
  ["M7", "add torrent and metadata flow", ["M6"]],
  ["M8", "pause resume remove", ["M7"]],
  ["M9", "crash recovery and resume data", ["M8"]],
  ["M10", "download doctor real diagnostics", ["M9"]],
];

for (const [id, name, dependencies] of nodes) {
  console.log(`${id}: ${name}`);
  console.log(`  depends_on: ${dependencies.length ? dependencies.join(", ") : "none"}`);
}
