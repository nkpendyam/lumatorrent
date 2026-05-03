import { describe, expect, it, vi } from "vitest";
import {
  describeEngineConnection,
  type EngineLifecycleConfig,
  type EngineProcessController,
  getEngineLifecycleNotice,
  initializeEngineLifecycle,
  resolveEngineLifecycleConfig,
} from "./engineLifecycle";

const localConfig: EngineLifecycleConfig = {
  mode: "local-sidecar",
  baseUrl: "http://127.0.0.1:17391/v1",
  authToken: "",
  healthTimeoutMs: 1500,
  startupTimeoutMs: 4000,
  fallbackToMock: false,
  manageProcess: false,
};

describe("engine lifecycle config", () => {
  it("defaults to mock mode", () => {
    expect(resolveEngineLifecycleConfig({})).toMatchObject({
      mode: "mock",
      baseUrl: "http://127.0.0.1:17391/v1",
      healthTimeoutMs: 1500,
      startupTimeoutMs: 4000,
      fallbackToMock: false,
      manageProcess: false,
    });
  });

  it("selects local sidecar mode from explicit config", () => {
    expect(
      resolveEngineLifecycleConfig({
        VITE_LUMATORRENT_ENGINE_MODE: "local-sidecar",
        VITE_LUMATORRENT_ENGINE_BASE_URL: "http://127.0.0.1:17391/v1",
        VITE_LUMATORRENT_ENGINE_TOKEN: "token",
        VITE_LUMATORRENT_ENGINE_HEALTH_TIMEOUT_MS: "2000",
        VITE_LUMATORRENT_ENGINE_STARTUP_TIMEOUT_MS: "3000",
        VITE_LUMATORRENT_ENGINE_FALLBACK_TO_MOCK: "true",
        VITE_LUMATORRENT_ENGINE_MANAGE_PROCESS: "true",
      }),
    ).toMatchObject({
      mode: "local-sidecar",
      authToken: "token",
      healthTimeoutMs: 2000,
      startupTimeoutMs: 3000,
      fallbackToMock: true,
      manageProcess: true,
    });
  });

  it("does not include token material in connection descriptions", () => {
    const description = describeEngineConnection({
      ...localConfig,
      authToken: "super-secret-token",
    });

    expect(description).toContain("token:configured");
    expect(description).not.toContain("super-secret-token");
  });
});

describe("engine lifecycle initialization", () => {
  it("starts mock mode as ready", async () => {
    const state = await initializeEngineLifecycle({
      ...localConfig,
      mode: "mock",
    });

    await expect(state.client.listTorrents()).resolves.not.toHaveLength(0);
    expect(state).toMatchObject({ mode: "mock", status: "ready" });
    expect(getEngineLifecycleNotice(state)).toBe("Engine connected · Mock");
  });

  it("returns unavailable mode without crashing", async () => {
    const state = await initializeEngineLifecycle({
      ...localConfig,
      mode: "unavailable",
    });

    expect(state.status).toBe("unavailable");
    expect(getEngineLifecycleNotice(state)).toContain("Local engine is unavailable");
  });

  it("normalizes missing unmanaged sidecar token as unavailable", async () => {
    const state = await initializeEngineLifecycle(localConfig);

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
      ...localConfig,
      authToken: "token",
      healthTimeoutMs: 1,
      startupTimeoutMs: 1,
      fallbackToMock: true,
    });

    expect(state).toMatchObject({ mode: "mock", status: "ready" });
    expect(state.message).toBe("Engine request failed.");
    vi.unstubAllGlobals();
  });

  it("starts managed local sidecar before health polling", async () => {
    let capturedStartConfig: {
      baseUrl: string;
      authToken: string;
      startupTimeoutMs: number;
    } | null = null;
    let capturedAuthToken = "";
    const startEngine = vi.fn(async () => ({
      status: "starting" as const,
      mode: "local-sidecar" as const,
      baseUrl: "http://127.0.0.1:17391/v1",
      startedAtIso: "2026-05-03T00:00:00.000Z",
      pid: 123,
    }));
    const controller: EngineProcessController = {
      startEngine: async (config) => {
        capturedStartConfig = config;
        capturedAuthToken = config.authToken;
        return startEngine();
      },
      stopEngine: vi.fn(),
      engineStatus: vi.fn(),
      engineHealth: vi.fn(),
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              ok: true,
              apiVersion: "v1",
              engineVersion: "0.1.0",
              torrentBackend: "mock",
              uptimeSeconds: 1,
            }),
          ),
      ),
    );

    const state = await initializeEngineLifecycle(
      {
        ...localConfig,
        authToken: "",
        healthTimeoutMs: 20,
        startupTimeoutMs: 20,
        manageProcess: true,
      },
      controller,
    );

    expect(capturedStartConfig).not.toBeNull();
    const startedConfig = capturedStartConfig as NonNullable<typeof capturedStartConfig>;
    expect(startedConfig).toMatchObject({
      baseUrl: "http://127.0.0.1:17391/v1",
      startupTimeoutMs: 20,
    });
    expect(capturedAuthToken).toHaveLength(48);
    expect(state).toMatchObject({ mode: "local-sidecar", status: "ready" });
    vi.unstubAllGlobals();
  });
});
