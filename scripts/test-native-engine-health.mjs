import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const isWindows = process.platform === "win32";
const engineAuthToken = randomBytes(24).toString("hex");
const port = String(48000 + (process.pid % 1000));

const build = isWindows
  ? spawnSync(
      "powershell",
      ["-ExecutionPolicy", "Bypass", "-File", "scripts\\build-native-engine.ps1", "stub"],
      { cwd: root, stdio: "inherit" },
    )
  : spawnSync("bash", ["scripts/build-native-engine.sh", "stub"], {
      cwd: root,
      stdio: "inherit",
    });

if (build.status !== 0) {
  throw new Error(`Native stub build failed with exit code ${build.status}.`);
}

const binary = path.join(
  root,
  "build",
  "native-engine-stub",
  isWindows ? "lumatorrent-native-engine.exe" : "lumatorrent-native-engine",
);

const server = spawn(binary, ["--serve"], {
  cwd: root,
  env: {
    ...process.env,
    LUMATORRENT_ENGINE_PORT: port,
    LUMATORRENT_ENGINE_TOKEN: engineAuthToken,
  },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

try {
  const healthUrl = `http://127.0.0.1:${port}/v1/health`;
  const unauthorized = await waitForResponse(healthUrl);
  assert(unauthorized.status === 401, "Native health endpoint must reject missing token.");

  const missingVersion = await fetch(healthUrl, {
    headers: {
      "X-Luma-Engine-Token": engineAuthToken,
    },
  });
  assert(
    missingVersion.status === 400,
    `Expected missing version status 400, got ${missingVersion.status}.`,
  );

  const authorized = await fetch(healthUrl, {
    headers: {
      "X-Luma-Engine-Token": engineAuthToken,
      "X-Luma-Engine-Version": "v1",
    },
  });
  assert(authorized.status === 200, `Expected health status 200, got ${authorized.status}.`);

  const body = await authorized.json();
  assert(body.ok === true, "Native health ok flag must be true.");
  assert(body.apiVersion === "v1", "Native health must identify the v1 API.");
  assert(body.engineVersion === "native-0.1.0", "Native health must identify native version.");
  assert(body.torrentBackend === "stub", "Native stub health must identify the stub backend.");
  assert(typeof body.uptimeSeconds === "number", "Native health must expose uptime.");

  console.log("Native engine health smoke OK");
} finally {
  if (!server.killed) {
    server.kill();
  }
}

async function waitForResponse(url) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Native engine exited before health check completed.\n${output}`);
    }

    try {
      return await fetch(url);
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }

  throw new Error(`Native engine health endpoint did not become ready: ${lastError}\n${output}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`${message}\n${output}`);
  }
}
