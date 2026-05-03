export const featureFlags = {
  nativeEngine: false,
  downloadDoctor: true,
  smartQueue: false,
  mediaPreview: false,
  remoteDashboard: false,
  pluginSystem: false,
  experimentalAnimations: true,
  telemetry: false,
  crashReports: false,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export function isFeatureEnabled(name: FeatureFlagName): boolean {
  return featureFlags[name];
}
