import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const isWindows = process.platform === "win32";
const engineAuthToken = randomBytes(24).toString("hex");
const port = String(48100 + (process.pid % 1000));
const magnetUri =
  "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=LumaTorrent+Legal+Fixture";

const build = isWindows
  ? spawnSync(
      "powershell",
      ["-ExecutionPolicy", "Bypass", "-File", "scripts\\build-native-engine.ps1", "libtorrent"],
      { cwd: root, stdio: "inherit" },
    )
  : spawnSync("bash", ["scripts/build-native-engine.sh", "libtorrent"], {
      cwd: root,
      stdio: "inherit",
    });

if (build.status !== 0) {
  throw new Error(`Native libtorrent build failed with exit code ${build.status}.`);
}

const binary = path.join(
  root,
  "build",
  "native-engine-libtorrent",
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
  const baseUrl = `http://127.0.0.1:${port}/v1`;
  await waitForResponse(`${baseUrl}/health`);

  const invalid = await postMagnet(baseUrl, {
    magnetUri: "not-a-magnet",
    savePath: path.join(root, "build", "legal-downloads"),
  });
  assert(invalid.status === 400, `Expected invalid magnet status 400, got ${invalid.status}.`);

  const accepted = await postMagnet(baseUrl, {
    magnetUri,
    savePath: path.join(root, "build", "legal-downloads"),
  });
  assert(accepted.status === 202, `Expected add magnet status 202, got ${accepted.status}.`);
  const acceptedBody = await accepted.json();
  assert(
    acceptedBody.torrentId === "0123456789abcdef0123456789abcdef01234567",
    "Accepted magnet must return the v1 info hash as torrentId.",
  );
  assert(acceptedBody.status === "metadata", "Accepted magnet must enter metadata state.");

  const duplicate = await postMagnet(baseUrl, {
    magnetUri,
    savePath: path.join(root, "build", "legal-downloads"),
  });
  assert(
    duplicate.status === 409,
    `Expected duplicate magnet status 409, got ${duplicate.status}.`,
  );

  const list = await fetch(`${baseUrl}/torrents`, {
    headers: engineHeaders(),
  });
  assert(list.status === 200, `Expected list status 200, got ${list.status}.`);
  const listBody = await list.json();
  assert(Array.isArray(listBody), "Torrent list must be a contract array.");
  assert(listBody.length === 1, "Torrent list must include one accepted magnet.");
  assert(listBody[0].status === "metadata", "Listed magnet must stay in metadata state.");
  assert(Array.isArray(listBody[0].files), "Listed magnet must expose a files array.");

  const events = await fetch(`${baseUrl}/events?limit=10`, {
    headers: engineHeaders(),
  });
  assert(events.status === 200, `Expected events status 200, got ${events.status}.`);
  const eventsBody = await events.json();
  assert(Array.isArray(eventsBody.events), "Events response must include events array.");
  const addedEvent = eventsBody.events.find((event) => event.type === "torrent.added");
  assert(addedEvent, "Native engine must emit a torrent.added event.");
  assert(
    addedEvent.torrentId === acceptedBody.torrentId,
    "torrent.added must use accepted torrentId.",
  );
  assert(
    addedEvent.payload?.status === "metadata",
    "torrent.added payload must start in metadata.",
  );

  const afterEvents = await fetch(`${baseUrl}/events?after=${addedEvent.sequence}&limit=10`, {
    headers: engineHeaders(),
  });
  assert(
    afterEvents.status === 200,
    `Expected after-events status 200, got ${afterEvents.status}.`,
  );
  const afterEventsBody = await afterEvents.json();
  assert(Array.isArray(afterEventsBody.events), "after-events response must include events array.");
  assert(
    afterEventsBody.events.every((event) => event.sequence > addedEvent.sequence),
    "Events after cursor must only include newer events.",
  );

  const pause = await postEmpty(`${baseUrl}/torrents/${acceptedBody.torrentId}/pause`);
  assert(pause.status === 200, `Expected pause status 200, got ${pause.status}.`);
  let lifecycleList = await listTorrents(baseUrl);
  assert(lifecycleList[0].status === "paused", "Paused torrent must be listed as paused.");

  const resume = await postEmpty(`${baseUrl}/torrents/${acceptedBody.torrentId}/resume`);
  assert(resume.status === 200, `Expected resume status 200, got ${resume.status}.`);
  lifecycleList = await listTorrents(baseUrl);
  assert(
    lifecycleList[0].status === "metadata",
    "Resumed metadata torrent must return to metadata state.",
  );

  const remove = await postEmpty(`${baseUrl}/torrents/${acceptedBody.torrentId}/remove`);
  assert(remove.status === 200, `Expected remove status 200, got ${remove.status}.`);
  lifecycleList = await listTorrents(baseUrl);
  assert(lifecycleList.length === 0, "Removed torrent must leave the native list.");

  console.log("Native engine add-magnet smoke OK");
} finally {
  if (!server.killed) {
    server.kill();
  }
}

async function postMagnet(baseUrl, body) {
  return fetch(`${baseUrl}/torrents/magnet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...engineHeaders(),
    },
    body: JSON.stringify(body),
  });
}

async function postEmpty(url) {
  return fetch(url, {
    method: "POST",
    headers: engineHeaders(),
  });
}

async function listTorrents(baseUrl) {
  const response = await fetch(`${baseUrl}/torrents`, {
    headers: engineHeaders(),
  });
  assert(response.status === 200, `Expected lifecycle list status 200, got ${response.status}.`);
  const body = await response.json();
  assert(Array.isArray(body), "Lifecycle list must be a contract array.");
  return body;
}

async function waitForResponse(url) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Native engine exited before add-magnet check completed.\n${output}`);
    }

    try {
      const response = await fetch(url, {
        headers: engineHeaders(),
      });
      if (response.status === 200) return response;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }

  throw new Error(`Native engine did not become ready: ${lastError}\n${output}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`${message}\n${output}`);
  }
}

function engineHeaders() {
  return {
    "X-Luma-Engine-Token": engineAuthToken,
    "X-Luma-Engine-Version": "v1",
  };
}
