import { assert, assertEquals, assertRejects } from "@std/assert";
import { createTcpTransport } from "../transport.ts";

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;

function withFetch(handler: Handler): () => void {
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) =>
    await handler(
      input instanceof Request ? input.url : String(input),
      init ?? {},
    );
  return () => globalThis.fetch = original;
}

function signalOf(init: RequestInit): AbortSignal {
  assert(init.signal, "transport must pass a signal to fetch");
  return init.signal;
}

function abortReason(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason));
  });
}

/** Response whose body stays open until the request signal aborts. */
function openBody(signal: AbortSignal): Response {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        signal.addEventListener("abort", () => controller.error(signal.reason));
      },
    }),
  );
}

const URI = "http://host:8080";

Deno.test("lifetime: pre-aborted caller signal rejects without fetching", async () => {
  let fetched = false;
  const restore = withFetch(() => {
    fetched = true;
    return new Response("{}");
  });
  const reason = new Error("gone");
  const t = createTcpTransport({ uri: URI, signal: AbortSignal.abort(reason) });
  try {
    assertEquals(await assertRejects(() => t.request("GET", "/x")), reason);
    assertEquals(fetched, false);
  } finally {
    restore();
    t.close();
  }
});

Deno.test("lifetime: close aborts pending requests, is idempotent, and is terminal", async () => {
  const restore = withFetch((_url, init) => abortReason(signalOf(init)));
  const t = createTcpTransport({ uri: URI });
  try {
    const pending = assertRejects(() => t.request("GET", "/slow"));
    t.close();
    t.close();
    await pending;
    await assertRejects(() => t.request("GET", "/after"));
    await assertRejects(() => t.requestStream("GET", "/after"));
    await assertRejects(() => t.requestRaw("GET", "/after"));
  } finally {
    restore();
  }
});

Deno.test("lifetime: caller signal abort closes the transport", async () => {
  const restore = withFetch((_url, init) => abortReason(signalOf(init)));
  const controller = new AbortController();
  const t = createTcpTransport({ uri: URI, signal: controller.signal });
  try {
    const pending = assertRejects(
      () => t.request("GET", "/slow"),
      Error,
      "stop",
    );
    controller.abort(new Error("stop"));
    await pending;
    await assertRejects(() => t.request("GET", "/after"));
  } finally {
    restore();
  }
});

Deno.test("lifetime: requestStream outlives the ordinary timeout until aborted", async () => {
  const restore = withFetch((_url, init) => openBody(signalOf(init)));
  const controller = new AbortController();
  const t = createTcpTransport({
    uri: URI,
    timeout: 10,
    signal: controller.signal,
  });
  try {
    const stream = await t.requestStream("GET", "/events");
    await new Promise((r) => setTimeout(r, 50));
    const reader = stream.getReader();
    const read = reader.read();
    controller.abort(new Error("stop"));
    await assertRejects(() => read, Error, "stop");
  } finally {
    restore();
    t.close();
  }
});

Deno.test("lifetime: close errors an open raw response body", async () => {
  const restore = withFetch((_url, init) => openBody(signalOf(init)));
  const t = createTcpTransport({ uri: URI });
  try {
    const res = await t.requestRaw("GET", "/attach");
    const text = assertRejects(() => res.text());
    t.close();
    await text;
  } finally {
    restore();
  }
});

Deno.test("lifetime: ordinary requests still time out when a caller signal is set", async () => {
  const restore = withFetch((_url, init) => abortReason(signalOf(init)));
  const t = createTcpTransport({
    uri: URI,
    timeout: 10,
    signal: new AbortController().signal,
  });
  try {
    for (let i = 0; i < 2; i++) {
      const err = await assertRejects(
        () => t.request("GET", "/slow"),
        DOMException,
      );
      assertEquals(err.name, "TimeoutError");
    }
  } finally {
    restore();
    t.close();
  }
});

Deno.test("lifetime: finished requests leave nothing for close to abort", async () => {
  const seen: AbortSignal[] = [];
  const restore = withFetch((_url, init) => {
    seen.push(signalOf(init));
    return new Response("{}", { status: 200 });
  });
  const t = createTcpTransport({ uri: URI });
  try {
    for (let i = 0; i < 25; i++) {
      await t.request("GET", "/a");
      await (await t.requestRaw("GET", "/b")).text();
      const stream = await t.requestStream("GET", "/c");
      await stream.cancel();
    }
    const unread = await t.requestRaw("GET", "/d");
    assertEquals(seen.length, 76);
    t.close();
    assertEquals(seen.slice(0, 75).some((s) => s.aborted), false);
    assert(seen[75].aborted);
    await unread.body?.cancel();
  } finally {
    restore();
  }
});

Deno.test("lifetime: requestRaw keeps url, redirected and type of the native response", async () => {
  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    (req) =>
      new URL(req.url).pathname.endsWith("/foo")
        ? Response.redirect(new URL("/bar", req.url), 302)
        : new Response("bar"),
  );
  const origin = `http://127.0.0.1:${server.addr.port}`;
  const t = createTcpTransport({ uri: origin });
  try {
    const res = await t.requestRaw("GET", "/foo");
    assertEquals(res.url, `${origin}/bar`);
    assertEquals(res.redirected, true);
    assertEquals(res.type, "basic");
    const copy = res.clone();
    assertEquals(copy.url, `${origin}/bar`);
    assertEquals(copy.redirected, true);
    assertEquals(await res.text(), "bar");
    assertEquals(await copy.text(), "bar");
  } finally {
    t.close();
    await server.shutdown();
  }
});

/** Counts argument-less callback timers that were started and neither fired nor cleared. */
function trackTimers(): { live: () => number; restore: () => void } {
  const { setTimeout: start, clearTimeout: stop } = globalThis;
  const pending = new Set<Parameters<typeof stop>[0]>();
  const track = (...[handler, ...rest]: Parameters<typeof start>) => {
    const [delay, ...args] = rest;
    if (typeof handler !== "function" || args.length > 0) {
      return start(handler, ...rest);
    }
    const id = start(() => {
      pending.delete(id);
      handler();
    }, delay);
    pending.add(id);
    return id;
  };
  const untrack = (id: Parameters<typeof stop>[0]) => {
    if (id !== undefined) pending.delete(id);
    stop(id);
  };
  globalThis.setTimeout = Object.assign(track, start);
  globalThis.clearTimeout = Object.assign(untrack, stop);
  return {
    live: () => pending.size,
    restore: () => {
      globalThis.setTimeout = start;
      globalThis.clearTimeout = stop;
    },
  };
}

Deno.test("lifetime: close frees request timers even if the response body is never read", async () => {
  const restore = withFetch(() =>
    new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new Uint8Array([1]));
        },
      }),
    )
  );
  const timers = trackTimers();
  const t = createTcpTransport({ uri: URI, timeout: 60_000 });
  try {
    await t.requestRaw("GET", "/body");
    assertEquals(timers.live(), 1);
    t.close();
    assertEquals(timers.live(), 0);
  } finally {
    timers.restore();
    restore();
  }
});
