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
  startupTimeoutMs: number;
  fallbackToMock: boolean;
  manageProcess: boolean;
};

export type EngineLifecycleState = {
  mode: EngineMode;
  status: EngineLifecycleStatus;
  client: EngineClient;
  health: EngineHealth | null;
  message: string | null;
};

export type EngineProcessStatus = {
  status: EngineLifecycleStatus;
  mode: "local-sidecar";
  baseUrl: string;
  startedAtIso: string | null;
  pid?: number;
};

export type EngineProcessController = {
  startEngine(
    config: Pick<EngineLifecycleConfig, "baseUrl" | "authToken" | "startupTimeoutMs">,
  ): Promise<EngineProcessStatus>;
  stopEngine(): Promise<EngineProcessStatus>;
  engineStatus(): Promise<EngineProcessStatus>;
  engineHealth(
    config: Pick<EngineLifecycleConfig, "baseUrl" | "authToken" | "healthTimeoutMs">,
  ): Promise<EngineHealth>;
};

type EngineEnv = Record<string, string | boolean | undefined>;

const defaultConfig: EngineLifecycleConfig = {
  mode: "mock",
  baseUrl: "http://127.0.0.1:17391/v1",
  authToken: "",
  healthTimeoutMs: 1_500,
  startupTimeoutMs: 4_000,
  fallbackToMock: false,
  manageProcess: false,
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
    startupTimeoutMs:
      parsePositiveInteger(env.VITE_LUMATORRENT_ENGINE_STARTUP_TIMEOUT_MS) ??
      defaultConfig.startupTimeoutMs,
    fallbackToMock: env.VITE_LUMATORRENT_ENGINE_FALLBACK_TO_MOCK === "true",
    manageProcess: env.VITE_LUMATORRENT_ENGINE_MANAGE_PROCESS === "true",
  };
}

function getDefaultEngineEnv(): EngineEnv {
  return ((import.meta as unknown as { env?: EngineEnv }).env ?? {}) as EngineEnv;
}

export async function initializeEngineLifecycle(
  config: EngineLifecycleConfig = resolveEngineLifecycleConfig(),
  processController: EngineProcessController = createDefaultEngineProcessController(config),
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

  const authToken = config.authToken || (config.manageProcess ? createSessionToken() : "");

  if (!authToken) {
    return localSidecarUnavailable(config, "Local engine auth token is not configured.");
  }

  try {
    if (config.manageProcess) {
      await processController.startEngine({ ...config, authToken });
    }
    const client = new HttpEngineClient({
      baseUrl: config.baseUrl,
      token: authToken,
      timeoutMs: config.healthTimeoutMs,
    });
    const health = await pollEngineHealth(client, config.startupTimeoutMs);
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
  if (state.status === "starting") return "Engine starting";
  if (state.status === "ready") return `Engine connected · ${formatEngineMode(state.mode)}`;
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

export class NoopEngineProcessController implements EngineProcessController {
  async startEngine(): Promise<EngineProcessStatus> {
    return unavailableProcessStatus("Process management is not available outside Tauri.");
  }

  async stopEngine(): Promise<EngineProcessStatus> {
    return unavailableProcessStatus("Process management is not available outside Tauri.");
  }

  async engineStatus(): Promise<EngineProcessStatus> {
    return unavailableProcessStatus("Process management is not available outside Tauri.");
  }

  async engineHealth(): Promise<EngineHealth> {
    throw new EngineClientError(
      "Process management is not available outside Tauri.",
      "ENGINE_UNAVAILABLE",
    );
  }
}

export class TauriEngineProcessController implements EngineProcessController {
  async startEngine(
    config: Pick<EngineLifecycleConfig, "baseUrl" | "authToken" | "startupTimeoutMs">,
  ): Promise<EngineProcessStatus> {
    return invokeEngineCommand("start_engine", {
      request: {
        baseUrl: config.baseUrl,
        authToken: config.authToken,
        startupTimeoutMs: config.startupTimeoutMs,
      },
    });
  }

  async stopEngine(): Promise<EngineProcessStatus> {
    return invokeEngineCommand("stop_engine");
  }

  async engineStatus(): Promise<EngineProcessStatus> {
    return invokeEngineCommand("engine_status");
  }

  async engineHealth(
    config: Pick<EngineLifecycleConfig, "baseUrl" | "authToken" | "healthTimeoutMs">,
  ): Promise<EngineHealth> {
    return invokeEngineCommand("engine_health", {
      request: {
        baseUrl: config.baseUrl,
        authToken: config.authToken,
        healthTimeoutMs: config.healthTimeoutMs,
      },
    });
  }
}

export function createDefaultEngineProcessController(
  config: Pick<EngineLifecycleConfig, "manageProcess">,
): EngineProcessController {
  return config.manageProcess
    ? new TauriEngineProcessController()
    : new NoopEngineProcessController();
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

async function pollEngineHealth(
  client: EngineClient,
  startupTimeoutMs: number,
): Promise<EngineHealth> {
  const startedAt = Date.now();
  let lastError: unknown = null;

  while (Date.now() - startedAt <= startupTimeoutMs) {
    try {
      return await client.health();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => globalThis.setTimeout(resolve, 150));
    }
  }

  throw lastError ?? new EngineClientError("Local engine startup timed out.", "ENGINE_UNAVAILABLE");
}

function createSessionToken(): string {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatEngineMode(mode: EngineMode): string {
  if (mode === "local-sidecar") return "Local sidecar";
  if (mode === "unavailable") return "Unavailable";
  return "Mock";
}

function unavailableProcessStatus(_message: string): EngineProcessStatus {
  return {
    status: "unavailable",
    mode: "local-sidecar",
    baseUrl: defaultConfig.baseUrl,
    startedAtIso: null,
  };
}

async function invokeEngineCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
}
