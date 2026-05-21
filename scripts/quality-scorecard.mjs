const scorecard = [
  ["Repo structure", "Strong"],
  ["Execution discipline", "Strong"],
  ["Design system", "Strong scaffold"],
  ["Frontend", "Strong scaffold"],
  ["Backend", "Strong scaffold"],
  ["Real torrent engine", "Strong plan, not implemented"],
  ["Testing", "Strong scaffold"],
  ["Release", "Strong scaffold"],
  ["Production app", "Not yet"],
];
console.table(scorecard.map(([area, rating]) => ({ area, rating })));
