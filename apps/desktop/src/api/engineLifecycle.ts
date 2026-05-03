import { createEngineUnavailableError, type EngineHealth } from "@lumatorrent/shared";
import {
  EngineClientError,
  HttpEngineClient,
  UnavailableEngineClient,
  type EngineClient,
} from "./engineClient";
import { createMockEngineClient, type MockEngineClient } from "./mockEngineClient";

export type EngineMode = "mock" | "local-sidecar" | "unavailable";
export type EngineLifecycleStatus = "starting" | "ready" | "unavailable" | "stopped";

export type EngineLifecycleConfig = {
  mode: EngineMode;
  baseUrl: string;
  authToken: string;
  healthTimeoutMs: number;
  fallbackToMock: boolean;
};

export type EngineLifecycleState = {
  mode: EngineMode;
  status: EngineLifecycleStatus;
  client: EngineClient;
  health: EngineHealth | null;
  message: string | null;
};

type EngineEnv = Record<string, string | boolean | undefined>;

const defaultConfig: EngineLifecycleConfig = {
  mode: "mock",
  baseUrl: "http://127.0.0.1:17391/v1",
  authToken: "",
  healthTimeoutMs: 1_500,
  fallbackToMock: false,
};

export function resolveEngineLifecycleConfig(
  env: EngineEnv = getDefaultEngineEnv(),
): EngineLifecycleConfig {
  return {
    mode: parseEngineMode(env.VITE_LUMATORRENT_ENGINE_MODE),
    baseUrl: parseString(env.VITE_LUMATORRENT_ENGINE_BASE_URL) ?? defaultConfig.baseUrl,
    authToken: parseString(env.VITE_LUMATORRENT_ENGINE_TOKEN) ?? "",
    healthTimeoutMs:
      parsePositiveInteger(env.VITE_LUMATORRENT_ENGINE_HEALTH_TIMEOUT_MS) ??
      defaultConfig.healthTimeoutMs,
    fallbackToMock: env.VITE_LUMATORRENT_ENGINE_FALLBACK_TO_MOCK === "true",
  };
}

function getDefaultEngineEnv(): EngineEnv {
  return ((import.meta as unknown as { env?: EngineEnv }).env ?? {}) as EngineEnv;
}

export async function initializeEngineLifecycle(
  config: EngineLifecycleConfig = resolveEngineLifecycleConfig(),
): Promise<EngineLifecycleState> {
  if (config.mode === "mock") {
    const client = createMockEngineClient();
    return {
      mode: "mock",
      status: "ready",
      client,
      health: await client.health(),
      message: null,
    };
  }

  if (config.mode === "unavailable") {
    const client = new UnavailableEngineClient();
    return {
      mode: "unavailable",
      status: "unavailable",
      client,
      health: await client.health(),
      message: "Local engine is unavailable. Downloads are paused until the engine is available.",
    };
  }

  if (!config.authToken) {
    return localSidecarUnavailable(config, "Local engine auth token is not configured.");
  }

  try {
    const client = new HttpEngineClient({
      baseUrl: config.baseUrl,
      token: config.authToken,
      timeoutMs: config.healthTimeoutMs,
    });
    const health = await client.health();
    return {
      mode: "local-sidecar",
      status: health.ok ? "ready" : "unavailable",
      client,
      health,
      message: health.ok ? null : "Local engine reported an unhealthy status.",
    };
  } catch (error) {
    return localSidecarUnavailable(config, normalizeLifecycleMessage(error));
  }
}

export function getEngineLifecycleNotice(
  state: Pick<EngineLifecycleState, "mode" | "status" | "message">,
): string | null {
  if (state.status !== "unavailable") return null;
  return state.message ?? `Engine mode ${state.mode} is unavailable.`;
}

export function describeEngineConnection(config: EngineLifecycleConfig): string {
  const tokenState = config.authToken ? "configured" : "missing";
  return `${config.mode} ${config.baseUrl} token:${tokenState}`;
}

export function isTickingMockClient(client: EngineClient): client is MockEngineClient {
  return "tick" in client && typeof (client as { tick?: unknown }).tick === "function";
}

function parseEngineMode(value: unknown): EngineMode {
  if (value === "local-sidecar" || value === "unavailable") return value;
  return "mock";
}

function parseString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parsePositiveInteger(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function localSidecarUnavailable(
  config: EngineLifecycleConfig,
  message: string,
): Promise<EngineLifecycleState> {
  if (config.fallbackToMock) {
    const client = createMockEngineClient();
    return {
      mode: "mock",
      status: "ready",
      client,
      health: await client.health(),
      message,
    };
  }

  const client = new UnavailableEngineClient();
  return {
    mode: "local-sidecar",
    status: "unavailable",
    client,
    health: await client.health(),
    message,
  };
}

function normalizeLifecycleMessage(error: unknown): string {
  if (error instanceof EngineClientError) {
    return error.message;
  }
  return createEngineUnavailableError("Local engine health check failed.").message;
}
