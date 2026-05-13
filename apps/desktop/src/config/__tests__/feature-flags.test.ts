import { describe, expect, it } from "vitest";
import { featureFlags, isFeatureEnabled } from "../feature-flags";

describe("feature flags", () => {
  it("keeps risky features disabled by default", () => {
    expect(featureFlags.remoteDashboard).toBe(false);
    expect(featureFlags.pluginSystem).toBe(false);
    expect(featureFlags.telemetry).toBe(false);
    expect(featureFlags.crashReports).toBe(false);
  });

  it("checks a feature flag by name", () => {
    expect(isFeatureEnabled("downloadDoctor")).toBe(true);
  });
});
