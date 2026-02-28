
import { assertEquals, assertRejects } from "@std/assert";
import { PodmanError } from "../types/errors.ts";
import { createTransport, createTcpTransport } from "../transport.ts";

// ─── Stub helpers ────────────────────────────────────────────────────────────

const fakeClient = { close() {} };

function stubCreateHttpClient(): { restore: () => void } {
  const original = Deno.createHttpClient;
  // deno-lint-ignore no-explicit-any
  (Deno as any).createHttpClient = () => fakeClient;
  // deno-lint-ignore no-explicit-any
  return { restore: () => (Deno as any).createHttpClient = original };
}

function stubFetch(
  handler: (url: string, init: RequestInit) => Response | Promise<Response>,
): { restore: () => void } {
  const original = globalThis.fetch;
  // deno-lint-ignore no-explicit-any
  globalThis.fetch = handler as any;
  return { restore: () => globalThis.fetch = original };
}

// ─── request() ───────────────────────────────────────────────────────────────

Deno.test("transport.request: parses valid JSON", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch((_url, _init) =>
    new Response(JSON.stringify({ Id: "abc" }), { status: 200 })
  );
  try {
    const { status, json } = await t.request("GET", "/test");
    assertEquals(status, 200);
    assertEquals((json as { Id: string }).Id, "abc");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: returns null json for empty body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(() => new Response("", { status: 200 }));
  try {
    const { status, json } = await t.request("DELETE", "/test");
    assertEquals(status, 200);
    assertEquals(json, null);
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: returns null json for whitespace body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(() => new Response("   \n  ", { status: 200 }));
  try {
    const { json } = await t.request("POST", "/test");
    assertEquals(json, null);
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: throws PodmanError on invalid JSON", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(() => new Response("not json at all", { status: 200 }));
  try {
    const err = await assertRejects(
      () => t.request("GET", "/bad"),
      PodmanError,
    );
    assertEquals(err.status, 200);
    assertEquals(err.method, "GET");
    assertEquals(err.path, "/bad");
    assertEquals(err.message.startsWith("Invalid JSON response:"), true);
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: sets Content-Type when body provided", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  let capturedHeaders: HeadersInit | undefined;
  const s2 = stubFetch((_url, init) => {
    capturedHeaders = init.headers;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("POST", "/test", { foo: "bar" });
    const h = capturedHeaders as Record<string, string>;
    assertEquals(h["Content-Type"], "application/json");
    assertEquals(h["Accept"], "application/json");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: no Content-Type when no body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  let capturedHeaders: HeadersInit | undefined;
  const s2 = stubFetch((_url, init) => {
    capturedHeaders = init.headers;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/test");
    const h = capturedHeaders as Record<string, string>;
    assertEquals(h["Content-Type"], undefined);
    assertEquals(h["Accept"], "application/json");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: builds correct URL with default apiVersion", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  let capturedUrl = "";
  const s2 = stubFetch((url) => {
    capturedUrl = url;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/containers/json");
    assertEquals(
      capturedUrl,
      "http://localhost/v4.0.0/libpod/containers/json",
    );
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.request: uses custom apiVersion", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({
    socketPath: "/tmp/fake.sock",
    apiVersion: "5.0.0",
  });
  let capturedUrl = "";
  const s2 = stubFetch((url) => {
    capturedUrl = url;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/info");
    assertEquals(capturedUrl, "http://localhost/v5.0.0/libpod/info");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

// ─── requestStream() ────────────────────────────────────────────────────────

Deno.test("transport.requestStream: returns body on success", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const s2 = stubFetch(
    () => new Response(stream, { status: 200 }),
  );
  try {
    const result = await t.requestStream("GET", "/events");
    assertEquals(result instanceof ReadableStream, true);
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.requestStream: throws PodmanError on 4xx with JSON body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(
    () =>
      new Response(JSON.stringify({ message: "not found" }), { status: 404 }),
  );
  try {
    const err = await assertRejects(
      () => t.requestStream("GET", "/logs"),
      PodmanError,
    );
    assertEquals(err.status, 404);
    assertEquals(err.message, "not found");
    assertEquals(err.method, "GET");
    assertEquals(err.path, "/logs");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.requestStream: throws PodmanError on 5xx with plain text", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(
    () => new Response("internal server error", { status: 500 }),
  );
  try {
    const err = await assertRejects(
      () => t.requestStream("GET", "/stream"),
      PodmanError,
    );
    assertEquals(err.status, 500);
    assertEquals(err.message, "internal server error");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.requestStream: throws PodmanError on error with empty body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(() => new Response("", { status: 500 }));
  try {
    const err = await assertRejects(
      () => t.requestStream("POST", "/fail"),
      PodmanError,
    );
    assertEquals(err.status, 500);
    assertEquals(err.message, "Stream request failed");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.requestStream: throws Error when response has no body", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(() => {

    const res = new Response(null, { status: 200 });
    return res;
  });
  try {
    await assertRejects(
      () => t.requestStream("GET", "/nobody"),
      Error,
      "No response body",
    );
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

// ─── requestRaw() ───────────────────────────────────────────────────────────

Deno.test("transport.requestRaw: passes through body and headers", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  let capturedBody: BodyInit | null | undefined;
  let capturedHeaders: HeadersInit | undefined;
  const s2 = stubFetch((_url, init) => {
    capturedBody = init.body;
    capturedHeaders = init.headers;
    return new Response("ok", { status: 200 });
  });
  try {
    const res = await t.requestRaw("POST", "/raw", "data", {
      "Content-Type": "text/plain",
    });
    assertEquals(res.status, 200);
    assertEquals(capturedBody, "data");
    assertEquals(
      (capturedHeaders as Record<string, string>)["Content-Type"],
      "text/plain",
    );
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});

Deno.test("transport.requestRaw: returns raw Response object", async () => {
  const s1 = stubCreateHttpClient();
  const t = createTransport({ socketPath: "/tmp/fake.sock" });
  const s2 = stubFetch(
    () => new Response("hello", { status: 201 }),
  );
  try {
    const res = await t.requestRaw("POST", "/create");
    assertEquals(res.status, 201);
    assertEquals(await res.text(), "hello");
  } finally {
    s2.restore();
    s1.restore();
    t.close();
  }
});


// ─── TCP transport ──────────────────────────────────────────────────────────

Deno.test("tcpTransport.request: builds correct URL from uri", async () => {
  const t = createTcpTransport({ uri: "http://192.168.1.100:8080" });
  let capturedUrl = "";
  const s = stubFetch((url) => {
    capturedUrl = url;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/containers/json");
    assertEquals(
      capturedUrl,
      "http://192.168.1.100:8080/v4.0.0/libpod/containers/json",
    );
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.request: strips trailing slash from uri", async () => {
  const t = createTcpTransport({ uri: "http://host:8080///" });
  let capturedUrl = "";
  const s = stubFetch((url) => {
    capturedUrl = url;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/info");
    assertEquals(capturedUrl, "http://host:8080/v4.0.0/libpod/info");
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.request: uses custom apiVersion", async () => {
  const t = createTcpTransport({
    uri: "http://host:8080",
    apiVersion: "5.1.0",
  });
  let capturedUrl = "";
  const s = stubFetch((url) => {
    capturedUrl = url;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/info");
    assertEquals(capturedUrl, "http://host:8080/v5.1.0/libpod/info");
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.request: parses JSON response", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  const s = stubFetch(() =>
    new Response(JSON.stringify({ Id: "abc123" }), { status: 200 })
  );
  try {
    const { status, json } = await t.request("GET", "/test");
    assertEquals(status, 200);
    assertEquals((json as { Id: string }).Id, "abc123");
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.request: throws PodmanError on invalid JSON", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  const s = stubFetch(() => new Response("not json", { status: 200 }));
  try {
    const err = await assertRejects(
      () => t.request("GET", "/bad"),
      PodmanError,
    );
    assertEquals(err.status, 200);
    assertEquals(err.message.startsWith("Invalid JSON response:"), true);
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.request: sends JSON body with Content-Type", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  let capturedHeaders: HeadersInit | undefined;
  let capturedBody: BodyInit | null | undefined;
  const s = stubFetch((_url, init) => {
    capturedHeaders = init.headers;
    capturedBody = init.body;
    return new Response("{}", { status: 201 });
  });
  try {
    await t.request("POST", "/containers/create", { image: "alpine" });
    const h = capturedHeaders as Record<string, string>;
    assertEquals(h["Content-Type"], "application/json");
    assertEquals(capturedBody, JSON.stringify({ image: "alpine" }));
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.requestStream: returns body on success", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const s = stubFetch(() => new Response(stream, { status: 200 }));
  try {
    const result = await t.requestStream("GET", "/events");
    assertEquals(result instanceof ReadableStream, true);
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.requestStream: throws PodmanError on error", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  const s = stubFetch(
    () =>
      new Response(JSON.stringify({ message: "not found" }), { status: 404 }),
  );
  try {
    const err = await assertRejects(
      () => t.requestStream("GET", "/logs"),
      PodmanError,
    );
    assertEquals(err.status, 404);
    assertEquals(err.message, "not found");
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.requestRaw: passes through body and headers", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  let capturedBody: BodyInit | null | undefined;
  let capturedHeaders: HeadersInit | undefined;
  const s = stubFetch((_url, init) => {
    capturedBody = init.body;
    capturedHeaders = init.headers;
    return new Response("ok", { status: 200 });
  });
  try {
    const res = await t.requestRaw("POST", "/raw", "data", {
      "Content-Type": "text/plain",
    });
    assertEquals(res.status, 200);
    assertEquals(capturedBody, "data");
    assertEquals(
      (capturedHeaders as Record<string, string>)["Content-Type"],
      "text/plain",
    );
  } finally {
    s.restore();
    t.close();
  }
});

Deno.test("tcpTransport.close: is a no-op (does not throw)", () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  t.close();
  t.close(); // calling twice should be safe
});

Deno.test("tcpTransport.getAuthHeader: returns encoded auth when provided", () => {
  const t = createTcpTransport({
    uri: "http://host:8080",
    auth: { username: "user", password: "pass" },
  });
  const header = t.getAuthHeader();
  assertEquals(typeof header, "string");
  const decoded = JSON.parse(atob(header!));
  assertEquals(decoded.username, "user");
  assertEquals(decoded.password, "pass");
  t.close();
});

Deno.test("tcpTransport.getAuthHeader: returns undefined when no auth", () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  assertEquals(t.getAuthHeader(), undefined);
  t.close();
});

Deno.test("tcpTransport: does not pass client property to fetch", async () => {
  const t = createTcpTransport({ uri: "http://host:8080" });
  let capturedInit: RequestInit | undefined;
  const s = stubFetch((_url, init) => {
    capturedInit = init;
    return new Response("{}", { status: 200 });
  });
  try {
    await t.request("GET", "/test");
    assertEquals("client" in (capturedInit ?? {}), false);
  } finally {
    s.restore();
    t.close();
  }
});