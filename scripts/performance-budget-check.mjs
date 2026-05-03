/**
 * Lightweight budget check placeholder.
 * This intentionally does not pretend to benchmark the app.
 * It gives Codex a safe starting gate until real profiling is wired.
 */
const budgets = {
  maxDashboardTorrentsWithoutVirtualization: 100,
  maxTelemetryUiHz: 4,
  maxInitialMockRenderMs: 1500
};

console.log("Performance budget targets:");
console.log(JSON.stringify(budgets, null, 2));
console.log("Budget check placeholder OK");
