import { describe, expect, it } from "vitest";
import { getNextViewDensity } from "../../app/productState";
import {
  filterTorrents,
  getDashboardStats,
  getEmptyStateCopy,
  healthCopy,
  statusCopy,
} from "./dashboardModel";
import { createMockDashboardTorrents } from "./mockEngine";

describe("dashboard model", () => {
  it("includes mock torrents for the required dashboard states", () => {
    const statuses = new Set(createMockDashboardTorrents().map((torrent) => torrent.status));

    expect(statuses).toEqual(
      new Set(["downloading", "paused", "completed", "seeding", "metadata", "error"]),
    );
  });

  it("filters attention-needed downloads by error or weak availability", () => {
    const filtered = filterTorrents(createMockDashboardTorrents(), "attention", "");

    expect(filtered.map((torrent) => torrent.name)).toEqual([
      "Creative Commons Film Pack",
      "University Research Snapshot",
    ]);
  });

  it("searches by name, status, and health", () => {
    const byName = filterTorrents(createMockDashboardTorrents(), "all", "fedora");
    const byStatus = filterTorrents(createMockDashboardTorrents(), "all", "paused");
    const byHealth = filterTorrents(createMockDashboardTorrents(), "all", "dead");

    expect(byName).toHaveLength(1);
    expect(byName[0]?.status).toBe("seeding");
    expect(byStatus[0]?.name).toBe("OpenStreetMap Regional Extract");
    expect(byHealth[0]?.name).toBe("University Research Snapshot");
  });

  it("summarizes dashboard stats from mock data", () => {
    const stats = getDashboardStats(createMockDashboardTorrents());

    expect(stats.activeCount).toBe(3);
    expect(stats.attentionCount).toBe(2);
    expect(stats.completedCount).toBe(2);
    expect(stats.totalSpeedBytes).toBeGreaterThan(0);
  });

  it("provides clear empty-state copy for filtered searches", () => {
    expect(getEmptyStateCopy("all", "not found").title).toBe("No downloads match that search");
    expect(getEmptyStateCopy("paused", "").description).toContain("no matching items");
  });

  it("exposes accessible status and health microcopy", () => {
    expect(statusCopy.metadata.label).toBe("Finding peers...");
    expect(statusCopy.completed.label).toBe("Download complete");
    expect(statusCopy.error.label).toBe("Needs attention");
    expect(healthCopy.weak.label).toBe("Weak availability");
    expect(healthCopy.dead.label).toBe("Waiting for seeders");
  });

  it("toggles between card and table density", () => {
    expect(getNextViewDensity("cards")).toBe("table");
    expect(getNextViewDensity("table")).toBe("cards");
  });
});
