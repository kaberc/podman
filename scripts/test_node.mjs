import * as fs from "node:fs";

import {
  createClient,
  createSshClient,
  createTransport,
  createTcpTransport,
  createSshTransport,
  PodmanError,
  ContainersApi,
  ImagesApi,
  NetworksApi,
  VolumesApi,
  PodsApi,
  SecretsApi,
  SystemApi,
  ExecApi,
  GenerateApi,
  ManifestsApi,
  KubeApi,
  ArtifactsApi,
  QuadletsApi,
} from "../npm/esm/mod.js";

let testCount = 0;
let passCount = 0;
let skipCount = 0;

function assert(condition, message) {
  testCount++;
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  passCount++;
  console.log(`  ✓ ${message}`);
}

function findSocket() {
  const rootful = "/run/podman/podman.sock";
  const xdg = process.env.XDG_RUNTIME_DIR;
  const explicit = process.env.PODMAN_SOCK;
  const rootless = xdg ? `${xdg}/podman/podman.sock` : null;

  for (const p of [explicit, rootless, rootful]) {
    if (!p) continue;
    try {
      if (fs.statSync(p)) return p;
    } catch { /* not found */ }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Export checks
// ---------------------------------------------------------------------------

console.log("\n--- Export checks ---");

assert(typeof createClient === "function", "createClient is exported");
assert(typeof createSshClient === "function", "createSshClient is exported");
assert(typeof createTransport === "function", "createTransport is exported");
assert(typeof createTcpTransport === "function", "createTcpTransport is exported");
assert(typeof createSshTransport === "function", "createSshTransport is exported");
assert(typeof PodmanError === "function", "PodmanError is exported");
assert(typeof ContainersApi === "function", "ContainersApi is exported");
assert(typeof ImagesApi === "function", "ImagesApi is exported");
assert(typeof NetworksApi === "function", "NetworksApi is exported");
assert(typeof VolumesApi === "function", "VolumesApi is exported");
assert(typeof PodsApi === "function", "PodsApi is exported");
assert(typeof SecretsApi === "function", "SecretsApi is exported");
assert(typeof SystemApi === "function", "SystemApi is exported");
assert(typeof ExecApi === "function", "ExecApi is exported");
assert(typeof GenerateApi === "function", "GenerateApi is exported");
assert(typeof ManifestsApi === "function", "ManifestsApi is exported");
assert(typeof KubeApi === "function", "KubeApi is exported");
assert(typeof ArtifactsApi === "function", "ArtifactsApi is exported");
assert(typeof QuadletsApi === "function", "QuadletsApi is exported");

// ---------------------------------------------------------------------------
// Transport construction
// ---------------------------------------------------------------------------

console.log("\n--- Transport construction ---");

const transport = createTransport({ socketPath: "/tmp/test.sock" });
assert(typeof transport.request === "function", "transport.request is a function");
assert(typeof transport.requestRaw === "function", "transport.requestRaw is a function");
assert(typeof transport.requestStream === "function", "transport.requestStream is a function");
assert(typeof transport.getAuthHeader === "function", "transport.getAuthHeader is a function");
assert(typeof transport.close === "function", "transport.close is a function");
transport.close();

const tcpTransport = createTcpTransport({ uri: "http://localhost:8080" });
assert(tcpTransport !== null && tcpTransport !== undefined, "createTcpTransport creates transport");
tcpTransport.close();

const tlsTransport = createTcpTransport({
  uri: "https://localhost:8443",
  tls: { caCerts: ["test"] },
});
assert(tlsTransport !== null && tlsTransport !== undefined, "createTcpTransport with TLS works");
tlsTransport.close();

const authedTransport = createTransport({
  socketPath: "/tmp/test.sock",
  auth: { username: "user", password: "pass" },
});
assert(typeof authedTransport.getAuthHeader() === "string", "auth header is set");
authedTransport.close();

const noAuthTransport = createTransport({ socketPath: "/tmp/test.sock" });
assert(noAuthTransport.getAuthHeader() === undefined, "no auth header when not set");
noAuthTransport.close();

// ---------------------------------------------------------------------------
// Client construction
// ---------------------------------------------------------------------------

console.log("\n--- Client construction ---");

const client = createClient({ socketPath: "/tmp/test.sock" });
assert(client.containers !== undefined, "client.containers exists");
assert(client.images !== undefined, "client.images exists");
assert(client.networks !== undefined, "client.networks exists");
assert(client.volumes !== undefined, "client.volumes exists");
assert(client.pods !== undefined, "client.pods exists");
assert(client.secrets !== undefined, "client.secrets exists");
assert(client.system !== undefined, "client.system exists");
assert(client.exec !== undefined, "client.exec exists");
assert(client.generate !== undefined, "client.generate exists");
assert(client.manifests !== undefined, "client.manifests exists");
assert(client.kube !== undefined, "client.kube exists");
assert(client.artifacts !== undefined, "client.artifacts exists");
assert(client.quadlets !== undefined, "client.quadlets exists");
client.close();

// ---------------------------------------------------------------------------
// PodmanError
// ---------------------------------------------------------------------------

console.log("\n--- PodmanError ---");

const error = new PodmanError({ status: 404, message: "not found", method: "GET", path: "/test" });
assert(error instanceof PodmanError, "PodmanError instance check");
assert(error instanceof Error, "PodmanError extends Error");
assert(error.status === 404, "PodmanError.status");
assert(error.message === "not found", "PodmanError.message");
assert(error.method === "GET", "PodmanError.method");
assert(error.path === "/test", "PodmanError.path");

// ---------------------------------------------------------------------------
// Live transport tests (require Podman socket)
// ---------------------------------------------------------------------------

const socketPath = findSocket();

if (!socketPath) {
  console.log("\n--- Skipping live transport tests (no Podman socket found) ---");
  skipCount += 8;
} else {
  console.log(`\n--- Live transport tests (socket: ${socketPath}) ---`);

  const liveTransport = createTransport({ socketPath });

  try {
    // requestRaw: /_ping returns plain text "OK"
    const pingRes = await liveTransport.requestRaw("GET", "/_ping");
    const pingText = await pingRes.text();
    assert(pingRes.status === 200, "requestRaw /_ping returns 200");
    assert(pingText === "OK", "requestRaw /_ping body is 'OK'");

    // request: /info returns JSON with host info
    const infoRes = await liveTransport.request("GET", "/info");
    assert(infoRes.status === 200, "request /info returns 200");
    assert(infoRes.json !== null && typeof infoRes.json === "object", "request /info returns JSON object");
    assert(typeof infoRes.json.host?.hostname === "string", "info.host.hostname is string");

    try {
      await liveTransport.request("GET", "/nonexistent-endpoint-xyz");
      assert(false, "non-existent endpoint should throw");
    } catch (e) {
      assert(e instanceof PodmanError && e.status === 404, "non-existent endpoint throws PodmanError 404");
    }

    // requestStream: returns a ReadableStream
    const streamRes = await liveTransport.requestStream("GET", "/containers/json");
    assert(streamRes instanceof ReadableStream, "requestStream returns ReadableStream");
    await streamRes.cancel();
  } finally {
    liveTransport.close();
  }

  // Full client integration
  console.log("\n--- Live client tests ---");

  const liveClient = createClient({ socketPath });
  try {
    const pingOk = await liveClient.system.ping();
    assert(pingOk === true, "client.system.ping() returns true");

    const version = await liveClient.system.version();
    assert(typeof version.Version === "string", "client.system.version() returns Version string");

    const containers = await liveClient.containers.list();
    assert(Array.isArray(containers), "client.containers.list() returns array");

    const images = await liveClient.images.list();
    assert(Array.isArray(images), "client.images.list() returns array");
  } finally {
    liveClient.close();
  }
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

console.log("\n--- Error handling ---");

const badTransport = createTransport({ socketPath: "/tmp/nonexistent-podman.sock" });
try {
  await badTransport.request("GET", "/info");
  assert(false, "bad socket should throw");
} catch (e) {
  assert(e instanceof Error, "bad socket throws Error");
}
badTransport.close();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const total = passCount + skipCount;
console.log(`\n${passCount} passed, ${skipCount} skipped (${total} total)`);
process.exit(0);
