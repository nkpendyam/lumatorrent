import { describe, expect, it, vi } from "vitest";
import {
  describeEngineConnection,
  getEngineLifecycleNotice,
  initializeEngineLifecycle,
  resolveEngineLifecycleConfig,
} from "./engineLifecycle";

describe("engine lifecycle config", () => {
  it("defaults to mock mode", () => {
    expect(resolveEngineLifecycleConfig({})).toMatchObject({
      mode: "mock",
      baseUrl: "http://127.0.0.1:17391/v1",
      healthTimeoutMs: 1500,
      fallbackToMock: false,
    });
  });

  it("selects local sidecar mode from explicit config", () => {
    expect(
      resolveEngineLifecycleConfig({
        VITE_LUMATORRENT_ENGINE_MODE: "local-sidecar",
        VITE_LUMATORRENT_ENGINE_BASE_URL: "http://127.0.0.1:17391/v1",
        VITE_LUMATORRENT_ENGINE_TOKEN: "token",
        VITE_LUMATORRENT_ENGINE_HEALTH_TIMEOUT_MS: "2000",
        VITE_LUMATORRENT_ENGINE_FALLBACK_TO_MOCK: "true",
      }),
    ).toMatchObject({
      mode: "local-sidecar",
      authToken: "token",
      healthTimeoutMs: 2000,
      fallbackToMock: true,
    });
  });

  it("does not include token material in connection descriptions", () => {
    const description = describeEngineConnection({
      mode: "local-sidecar",
      baseUrl: "http://127.0.0.1:17391/v1",
      authToken: "super-secret-token",
      healthTimeoutMs: 1500,
      fallbackToMock: false,
    });

    expect(description).toContain("token:configured");
    expect(description).not.toContain("super-secret-token");
  });
});

describe("engine lifecycle initialization", () => {
  it("starts mock mode as ready", async () => {
    const state = await initializeEngineLifecycle({
      mode: "mock",
      baseUrl: "http://127.0.0.1:17391/v1",
      authToken: "",
      healthTimeoutMs: 1500,
      fallbackToMock: false,
    });

    await expect(state.client.listTorrents()).resolves.not.toHaveLength(0);
    expect(state).toMatchObject({ mode: "mock", status: "ready" });
  });

  it("returns unavailable mode without crashing", async () => {
    const state = await initializeEngineLifecycle({
      mode: "unavailable",
      baseUrl: "http://127.0.0.1:17391/v1",
      authToken: "",
      healthTimeoutMs: 1500,
      fallbackToMock: false,
    });

    expect(state.status).toBe("unavailable");
    expect(getEngineLifecycleNotice(state)).toContain("Local engine is unavailable");
  });

  it("normalizes missing sidecar token as unavailable", async () => {
    const state = await initializeEngineLifecycle({
      mode: "local-sidecar",
      baseUrl: "http://127.0.0.1:17391/v1",
      authToken: "",
      healthTimeoutMs: 1500,
      fallbackToMock: false,
    });

    expect(state).toMatchObject({ mode: "local-sidecar", status: "unavailable" });
    expect(state.message).toContain("auth token");
  });

  it("can fall back to mock when local sidecar is not ready", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("offline");
      }),
    );

    const state = await initializeEngineLifecycle({
      mode: "local-sidecar",
      baseUrl: "http://127.0.0.1:17391/v1",
      authToken: "token",
      healthTimeoutMs: 1,
      fallbackToMock: true,
    });

    expect(state).toMatchObject({ mode: "mock", status: "ready" });
    expect(state.message).toBe("Engine request failed.");
    vi.unstubAllGlobals();
  });
});
