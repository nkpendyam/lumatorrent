import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = randomBytes(24).toString("hex");
const port = await getOpenPort();
const enginePath = path.join(
  root,
  "target",
  "debug",
  process.platform === "win32" ? "lumatorrent-engine.exe" : "lumatorrent-engine",
);

await run("cargo", ["build", "-p", "lumatorrent-engine", "--quiet"]);

const engine = spawn(enginePath, {
  cwd: root,
  env: {
    ...process.env,
    LUMATORRENT_ENGINE_TOKEN: token,
    LUMATORRENT_ENGINE_PORT: String(port),
  },
  stdio: ["ignore", "ignore", "ignore"],
});

try {
  const health = await pollHealth(port, token);
  assert(health.ok === true, "Expected healthy engine response.");
  assert(health.apiVersion === "v1", "Expected v1 health response.");
  assert(health.torrentBackend === "mock", "Expected mock backend.");

  const missingAuth = await fetch(`http://127.0.0.1:${port}/v1/health`, {
    headers: { "X-Luma-Engine-Version": "v1" },
  });
  assert(missingAuth.status === 401, "Expected missing token to be rejected.");

  const missingVersion = await fetch(`http://127.0.0.1:${port}/v1/health`, {
    headers: { "X-Luma-Engine-Token": token },
  });
  assert(missingVersion.status === 400, "Expected missing version header to be rejected.");

  console.log(`Mock sidecar health OK on 127.0.0.1:${port}`);
} finally {
  engine.kill();
}

async function pollHealth(port, tokenValue) {
  const deadline = Date.now() + 8_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/v1/health`, {
        headers: {
          "X-Luma-Engine-Version": "v1",
          "X-Luma-Engine-Token": tokenValue,
        },
      });
      if (response.ok) return response.json();
      lastError = new Error(`Health returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw lastError ?? new Error("Timed out waiting for mock sidecar health.");
}

async function getOpenPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === "object") {
          resolve(address.port);
        } else {
          reject(new Error("Could not allocate localhost test port."));
        }
      });
    });
  });
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
