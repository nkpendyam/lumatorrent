const milestones = [
  'M0 preflight and repo verification',
  'M1 design tokens and dashboard polish',
  'M2 settings persistence',
  'M3 engine contract tests',
  'M4 mock torrent lifecycle',
  'M5 safe delete-to-trash',
  'M6 .torrent parser adapter',
  'M7 magnet metadata state machine',
  'M8 libtorrent sidecar skeleton',
  'M9 Download Doctor real diagnostics',
  'M10 packaging dry run'
];
console.log(milestones.map((m, i) => `${i + 1}. ${m}`).join('\n'));
