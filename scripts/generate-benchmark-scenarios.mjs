import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("tests/performance", { recursive: true });
const scenarios = {
  scenarios: [
    { name: "dashboard-500-torrents", target: "no visible jank while scrolling" },
    { name: "event-rate-limit", target: "renderer receives aggregated updates" },
    { name: "cold-start", target: "document budget before implementation" }
  ]
};
writeFileSync("tests/performance/scenarios.json", JSON.stringify(scenarios, null, 2));
console.log("Wrote tests/performance/scenarios.json");
