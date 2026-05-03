const risks = [
  ["Real libtorrent packaging", "High", "Keep sidecar boundary and stub mode"],
  ["False speed claims", "High", "Use confidence labels and honest diagnostics"],
  ["File deletion bug", "Critical", "Trash only, exact file preview, no parent deletion"],
  ["Remote API exposure", "Critical", "Localhost only, token required, remote disabled"],
  ["UI jank under many torrents", "Medium", "virtualized lists, throttled events"],
];
console.table(risks.map(([risk, severity, mitigation]) => ({ risk, severity, mitigation })));
