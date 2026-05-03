import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const requiredPaths = [
  "/health",
  "/torrents",
  "/torrents/magnet",
  "/torrents/file",
  "/torrents/{id}/pause",
  "/torrents/{id}/resume",
  "/torrents/{id}/remove",
  "/torrents/{id}/recheck",
  "/torrents/{id}/diagnose",
  "/events",
];

const requiredEvents = [
  "torrent.added",
  "torrent.metadata",
  "torrent.progress",
  "torrent.completed",
  "torrent.paused",
  "torrent.error",
  "engine.restarted",
  "engine.health",
  "engine.crashed",
  "diagnostic.updated",
];

const requiredErrors = [
  "INVALID_MAGNET",
  "TORRENT_PARSE_FAILED",
  "METADATA_TIMEOUT",
  "NO_SEEDERS_OBSERVED",
  "PORT_CLOSED",
  "TRACKER_TIMEOUT",
  "DHT_UNAVAILABLE",
  "DISK_FULL",
  "PERMISSION_DENIED",
  "PATH_REJECTED",
  "ENGINE_UNAVAILABLE",
];

const openapi = await readJson("contracts/engine/openapi-lite.json");
const events = await readJson("contracts/engine/events.schema.json");
const errors = await readJson("contracts/engine/errors.schema.json");
const healthExample = await readJson("contracts/engine/examples/health.json");
const progressEventExample = await readJson("contracts/engine/examples/progress-event.json");

assert(openapi.openapi === "3.1.0", "OpenAPI contract must be 3.1.0.");
assert(
  openapi.servers?.[0]?.url?.startsWith("http://127.0.0.1:"),
  "Engine server must bind to 127.0.0.1.",
);
assert(
  openapi.components?.securitySchemes?.EngineToken?.name === "X-Luma-Engine-Token",
  "Engine auth header must be X-Luma-Engine-Token.",
);

for (const requiredPath of requiredPaths) {
  assert(openapi.paths?.[requiredPath], `Missing required engine path: ${requiredPath}`);
}

const eventEnum = events.properties?.type?.enum ?? [];
for (const eventType of requiredEvents) {
  assert(eventEnum.includes(eventType), `Missing required engine event type: ${eventType}`);
}
assert(events.required?.includes("sequence"), "Engine events must include sequence.");

const errorEnum = errors.properties?.code?.enum ?? [];
for (const errorCode of requiredErrors) {
  assert(errorEnum.includes(errorCode), `Missing required engine error code: ${errorCode}`);
}
assert(errors.required?.includes("recoverable"), "Engine errors must declare recoverable.");

assertHealthExample(healthExample);
assertProgressEventExample(progressEventExample);

console.log(
  `Engine contracts OK: ${requiredPaths.length} paths, ${requiredEvents.length} events, ${requiredErrors.length} errors.`,
);

async function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse ${relativePath}: ${error.message}`);
  }
}

function assertHealthExample(value) {
  assert(value.ok === true || value.ok === false, "Health example must include boolean ok.");
  assert(value.apiVersion === "v1", "Health example must include apiVersion v1.");
  assert(typeof value.engineVersion === "string", "Health example must include engineVersion.");
  assert(
    ["mock", "stub", "libtorrent"].includes(value.torrentBackend),
    "Health backend must be recognized.",
  );
  assert(typeof value.uptimeSeconds === "number", "Health example must include uptimeSeconds.");
}

function assertProgressEventExample(value) {
  assert(value.type === "torrent.progress", "Progress example must be torrent.progress.");
  assert(typeof value.timestamp === "string", "Progress example must include timestamp.");
  assert(typeof value.sequence === "number", "Progress example must include sequence.");
  assert(typeof value.torrentId === "string", "Progress example must include torrentId.");
  assert(
    typeof value.payload?.progress === "number",
    "Progress example must include payload.progress.",
  );
  assert(
    typeof value.payload?.downloadSpeedBytes === "number",
    "Progress example must include payload.downloadSpeedBytes.",
  );
  assert(
    typeof value.payload?.uploadSpeedBytes === "number",
    "Progress example must include payload.uploadSpeedBytes.",
  );
  assert(
    value.payload?.etaSeconds === null || typeof value.payload?.etaSeconds === "number",
    "Progress example must include payload.etaSeconds.",
  );
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}
