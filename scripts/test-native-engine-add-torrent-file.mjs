import { spawn, spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const isWindows = process.platform === "win32";
const engineAuthToken = randomBytes(24).toString("hex");
const port = String(49100 + (process.pid % 1000));
const fixtureDir = path.join(root, "build", "legal-torrent-fixtures");
const torrentFilePath = path.join(fixtureDir, "release.torrent");
const oversizedTorrentFilePath = path.join(fixtureDir, "oversized.torrent");
const savePath = path.join(root, "build", "legal-downloads-file");

await fs.mkdir(fixtureDir, { recursive: true });
await fs.mkdir(savePath, { recursive: true });

const infoDictionary = Buffer.concat([
  Buffer.from("d5:filesl"),
  Buffer.from("d6:lengthi10e4:pathl8:disc.isoee"),
  Buffer.from("d6:lengthi5e4:pathl4:docs10:readme.txtee"),
  Buffer.from("e4:name7:release12:piece lengthi16384e6:pieces20:"),
  Buffer.alloc(20),
  Buffer.from("e"),
]);
const torrentFile = Buffer.concat([
  Buffer.from("d8:announce14:http://tracker4:info"),
  infoDictionary,
  Buffer.from("e"),
]);
const expectedInfoHash = createHash("sha1").update(infoDictionary).digest("hex");
await fs.writeFile(torrentFilePath, torrentFile);
await fs.writeFile(oversizedTorrentFilePath, Buffer.alloc(10_000_001));

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

  const invalid = await postTorrentFile(baseUrl, {
    torrentFilePath: path.join(fixtureDir, "release.txt"),
    savePath,
  });
  assert(
    invalid.status === 400,
    `Expected invalid torrent file status 400, got ${invalid.status}.`,
  );

  const oversized = await postTorrentFile(baseUrl, {
    torrentFilePath: oversizedTorrentFilePath,
    savePath,
  });
  assert(
    oversized.status === 400,
    `Expected oversized torrent file status 400, got ${oversized.status}.`,
  );

  const accepted = await postTorrentFile(baseUrl, { torrentFilePath, savePath });
  assert(accepted.status === 202, `Expected add torrent file status 202, got ${accepted.status}.`);
  const acceptedBody = await accepted.json();
  assert(
    acceptedBody.torrentId === expectedInfoHash,
    "Accepted torrent file must return the parsed v1 info hash as torrentId.",
  );
  assert(acceptedBody.status === "checking", "Accepted torrent file must enter checking state.");

  const duplicate = await postTorrentFile(baseUrl, { torrentFilePath, savePath });
  assert(
    duplicate.status === 409,
    `Expected duplicate torrent file status 409, got ${duplicate.status}.`,
  );

  const list = await fetch(`${baseUrl}/torrents`, {
    headers: engineHeaders(),
  });
  assert(list.status === 200, `Expected list status 200, got ${list.status}.`);
  const listBody = await list.json();
  assert(Array.isArray(listBody), "Torrent list must be a contract array.");
  assert(listBody.length === 1, "Torrent list must include one imported torrent.");
  const imported = listBody[0];
  assert(imported.id === expectedInfoHash, "Imported torrent id must match the info hash.");
  assert(imported.name === "release", "Imported torrent must use the torrent metadata name.");
  assert(imported.sizeBytes === 15, "Imported torrent must expose the total file size.");
  assert(Array.isArray(imported.files), "Imported torrent must expose file metadata.");
  assert(imported.files.length === 2, "Imported torrent must expose both fixture files.");
  const filePaths = imported.files.map((file) => file.path.replaceAll("\\", "/"));
  assert(filePaths.includes("release/disc.iso"), "Imported files must include release/disc.iso.");
  assert(
    filePaths.includes("release/docs/readme.txt"),
    "Imported files must include release/docs/readme.txt.",
  );

  const events = await fetch(`${baseUrl}/events?limit=10`, {
    headers: engineHeaders(),
  });
  assert(events.status === 200, `Expected events status 200, got ${events.status}.`);
  const eventsBody = await events.json();
  const metadataEvent = eventsBody.events?.find((event) => event.type === "torrent.metadata");
  assert(metadataEvent, "Native file import must emit torrent.metadata.");
  assert(
    metadataEvent.payload?.summary?.files?.length === 2,
    "torrent.metadata must carry parsed file metadata.",
  );

  const remove = await postEmpty(`${baseUrl}/torrents/${expectedInfoHash}/remove`);
  assert(remove.status === 200, `Expected remove status 200, got ${remove.status}.`);

  console.log("Native engine add-torrent-file smoke OK");
} finally {
  if (!server.killed) {
    server.kill();
  }
}

async function postTorrentFile(baseUrl, body) {
  return fetch(`${baseUrl}/torrents/file`, {
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

async function waitForResponse(url) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Native engine exited before add-torrent-file check completed.\n${output}`);
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
