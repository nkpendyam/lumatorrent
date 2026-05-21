const scorecard = [
  ["Repo structure", "Strong"],
  ["Execution discipline", "Strong"],
  ["Design system", "Strong foundation"],
  ["Frontend", "Strong foundation"],
  ["Backend", "Strong foundation"],
  ["Real torrent engine", "Strong plan, not implemented"],
  ["Testing", "Strong foundation"],
  ["Release", "Strong foundation"],
  ["Production app", "Not yet"],
];
console.table(scorecard.map(([area, rating]) => ({ area, rating })));
