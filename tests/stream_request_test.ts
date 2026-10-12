import { assert, assertEquals, assertRejects } from "@std/assert";
import { buildTransport } from "../transport_core.ts";
import { PodmanServerError } from "../types/errors.ts";

Deno.test("stream requests forward upload bodies and registry headers", async () => {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("context"));
      controller.close();
    },
  });
  const transport = buildTransport(
    async (method, path, init) => {
      assertEquals(method, "POST");
      assertEquals(path, "/build");
      assertEquals(init?.body, body);
      assertEquals(init?.headers?.["X-Registry-Auth"], "credentials");
      assertEquals(init?.headers?.["Accept"], "application/json");
      return new Response("result");
    },
    undefined,
    () => {},
  );
  try {
    const stream = await transport.requestStream("POST", "/build", body, {
      "X-Registry-Auth": "credentials",
    });
    assertEquals(await new Response(stream).text(), "result");
  } finally {
    transport.close();
  }
});

Deno.test("requests without ordinary deadlines still honor their client signal", async () => {
  const controller = new AbortController();
  const transport = buildTransport(
    async (_method, _path, init) => {
      assert(init?.signal);
      const signal = init.signal;
      return new Response(
        new ReadableStream<Uint8Array>({
          start(output) {
            signal.addEventListener("abort", () => output.error(signal.reason));
          },
        }),
      );
    },
    undefined,
    () => {},
    { timeout: null, signal: controller.signal },
  );
  try {
    const response = await transport.requestRaw("POST", "/import");
    const reading = assertRejects(
      () => response.text(),
      Error,
      "cancel import",
    );
    controller.abort(new Error("cancel import"));
    await reading;
  } finally {
    transport.close();
  }
});

Deno.test("stream HTTP errors retain their typed status subclass and request details", async () => {
  const transport = buildTransport(
    async () =>
      new Response('{"message":"registry unavailable"}', { status: 503 }),
    undefined,
    () => {},
  );
  try {
    const error = await assertRejects(
      () => transport.requestStream("POST", "/images/pull?reference=alpine"),
      PodmanServerError,
      "registry unavailable",
    );
    assertEquals(error.constructor, PodmanServerError);
    assertEquals([error.status, error.method, error.path], [
      503,
      "POST",
      "/images/pull?reference=alpine",
    ]);
  } finally {
    transport.close();
  }
});
