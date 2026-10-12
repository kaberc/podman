import { assertEquals, assertRejects } from "@std/assert";
import { createClient } from "../client.ts";

Deno.test("a client rejects requests when its operation was already cancelled", async () => {
  let requests = 0;
  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    () => {
      requests++;
      return new Response("OK");
    },
  );
  const cancellation = new AbortController();
  cancellation.abort(new Error("cancelled operation"));
  const client = createClient({
    uri: `http://127.0.0.1:${server.addr.port}`,
    signal: cancellation.signal,
  });
  try {
    await assertRejects(
      () => client.system.ping(),
      Error,
      "cancelled operation",
    );
    assertEquals(requests, 0);
  } finally {
    client.close();
    await server.shutdown();
  }
});

Deno.test("disposing a client closes its lifetime and refuses later requests", async () => {
  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    () => new Response("OK"),
  );
  const client = createClient({ uri: `http://127.0.0.1:${server.addr.port}` });
  try {
    assertEquals(await client.system.ping(), true);
    client[Symbol.dispose]();
    await assertRejects(() => client.system.ping());
    client[Symbol.dispose]();
  } finally {
    client.close();
    await server.shutdown();
  }
});
