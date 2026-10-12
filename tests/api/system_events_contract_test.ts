import { assertEquals, assertRejects } from "@std/assert";
import { SystemApi } from "../../api/system.ts";
import { PodmanStreamError } from "../../internal/multiplexed-output.ts";
import { createTcpTransport } from "../../transport.ts";

async function withEvents(
  body: ReadableStream<Uint8Array>,
  action: (api: SystemApi) => Promise<void>,
) {
  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    () => new Response(body),
  );
  const transport = createTcpTransport({
    uri: `http://127.0.0.1:${server.addr.port}`,
  });
  try {
    await action(new SystemApi(transport));
  } finally {
    transport.close();
    await server.shutdown();
  }
}

function events(bytes: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

Deno.test("parsedEvents yields only objects when the wire contains JSON scalar values", async () => {
  const bytes = new TextEncoder().encode(
    'null\n[]\n42\n"text"\n{"status":"start"}\n',
  );
  await withEvents(events(bytes), async (api) => {
    const result = await Array.fromAsync(api.parsedEvents());
    assertEquals(result, [{ status: "start" }]);
  });
});

Deno.test("parsedEvents rejects an oversized record instead of buffering without a bound", async () => {
  await withEvents(
    events(new Uint8Array(1024 * 1024 + 1).fill(0x61)),
    async (api) => {
      await assertRejects(
        () => Array.fromAsync(api.parsedEvents()),
        PodmanStreamError,
      );
    },
  );
});

Deno.test("parsedEvents preserves fragmented UTF-8 and skips malformed lines", async () => {
  const bytes = new TextEncoder().encode(
    '{"name":"猫"}\n{broken\n{"status":"stop"}',
  );
  let offset = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset === bytes.length) controller.close();
      else controller.enqueue(bytes.subarray(offset, ++offset));
    },
  });
  await withEvents(body, async (api) => {
    assertEquals(await Array.fromAsync(api.parsedEvents()), [{ name: "猫" }, {
      status: "stop",
    }]);
  });
});
