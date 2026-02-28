import { assertEquals } from "@std/assert";
import { SystemApi } from "../../api/system.ts";
import { mockTransport } from "./_test_helpers.ts";

function makeStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

function makeSystemApi(chunks: string[]): SystemApi {
  return new SystemApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, _p) => makeStream(chunks),
    }),
  );
}

// ---------------------------------------------------------------------------
// system.parsedEvents — NDJSON line-buffered parsing
// ---------------------------------------------------------------------------

Deno.test("parsedEvents: yields single event per chunk", async () => {
  const api = makeSystemApi([
    '{"Type":"container","Action":"start"}\n',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 1);
  assertEquals(events[0].Type, "container");
  assertEquals(events[0].Action, "start");
});

Deno.test("parsedEvents: yields multiple events from one chunk", async () => {
  const api = makeSystemApi([
    '{"Type":"container","Action":"start"}\n{"Type":"image","Action":"pull"}\n',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 2);
  assertEquals(events[0].Type, "container");
  assertEquals(events[1].Type, "image");
});

Deno.test("parsedEvents: handles event split across chunks", async () => {
  const api = makeSystemApi([
    '{"Type":"conta',
    'iner","Action":"start"}\n',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 1);
  assertEquals(events[0].Type, "container");
  assertEquals(events[0].Action, "start");
});

Deno.test("parsedEvents: skips malformed JSON lines", async () => {
  const api = makeSystemApi([
    '{"Type":"container","Action":"start"}\n',
    "not valid json\n",
    '{"Type":"image","Action":"pull"}\n',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 2);
  assertEquals(events[0].Type, "container");
  assertEquals(events[1].Type, "image");
});

Deno.test("parsedEvents: handles trailing data without newline", async () => {
  const api = makeSystemApi([
    '{"Type":"container","Action":"stop"}',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 1);
  assertEquals(events[0].Action, "stop");
});

Deno.test("parsedEvents: skips empty lines", async () => {
  const api = makeSystemApi([
    '{"Type":"container"}\n\n\n{"Type":"image"}\n',
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 2);
});

Deno.test("parsedEvents: yields nothing for empty stream", async () => {
  const api = makeSystemApi([]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 0);
});

Deno.test("parsedEvents: yields nothing for whitespace-only stream", async () => {
  const api = makeSystemApi(["  \n  \n  "]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 0);
});

Deno.test("parsedEvents: passes query params to events()", async () => {
  let capturedPath = "";
  const api = new SystemApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return makeStream([]);
      },
    }),
  );
  // deno-lint-ignore no-empty
  for await (const _ of api.parsedEvents({ since: "2024-01-01" } as never)) {}
  assertEquals(capturedPath.includes("since="), true);
});

Deno.test("parsedEvents: handles many small chunks (byte-at-a-time)", async () => {
  const line = '{"Type":"container","Action":"die"}\n';
  const chunks = [...line].map((c) => c);
  const api = makeSystemApi(chunks);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 1);
  assertEquals(events[0].Action, "die");
});

Deno.test("parsedEvents: malformed trailing data is discarded", async () => {
  const api = makeSystemApi([
    '{"Type":"container"}\n',
    "not json at end",
  ]);
  const events: Record<string, unknown>[] = [];
  for await (const event of api.parsedEvents()) {
    events.push(event);
  }
  assertEquals(events.length, 1);
  assertEquals(events[0].Type, "container");
});
