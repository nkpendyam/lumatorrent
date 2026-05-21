# Feature Flags and Toggles

Feature flags let contributors build advanced features safely without destabilizing the app.

## Required flags

```ts
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
};
```

## Rules

- Dangerous features default to off.
- Remote dashboard must stay off until authentication, CSRF protection, rate limiting, and local-only defaults are implemented.
- Telemetry and crash reports must be opt-in.
- Native engine can be developed behind the `nativeEngine` flag while stub mode keeps CI stable.
- Experimental animation must respect reduced-motion accessibility settings.

## Implementation instruction

When implementing a risky or incomplete feature, put it behind a flag and add tests for both enabled and disabled states.
