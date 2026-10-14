import { assertEquals, assertRejects, assertStrictEquals } from "@std/assert";
import { ImagesApi } from "../../api/images.ts";
import { buildTransport } from "../../transport_core.ts";
import { PodmanError } from "../../types/errors.ts";

function images(body: string): ImagesApi {
  return new ImagesApi(buildTransport(
    async () => new Response(body),
    undefined,
    () => {},
  ));
}

Deno.test("images.pull returns terminal report when response contains NDJSON", async () => {
  const api = images('{"stream":"copying"}\n{"id":"abc","images":["abc"]}\n');
  const report = await api.pull({ reference: "alpine" });
  assertEquals(report, { id: "abc", images: ["abc"] });
});

Deno.test("images.pull rejects when quiet report contains an HTTP 200 error", async () => {
  const api = images('{"error":"registry denied"}');
  const error = await assertRejects(
    () => api.pull({ reference: "alpine", quiet: true }),
    PodmanError,
    "registry denied",
  );
  assertEquals([error.status, error.method, error.path], [
    200,
    "POST",
    "/images/pull?reference=alpine&quiet=true",
  ]);
});

Deno.test("images.pull decodes fragmented UTF8 and awaits progress callbacks", async () => {
  const bytes = new TextEncoder().encode(
    '{"stream":"複製"}\n{"stream":"done"}\n{"images":["abc"]}',
  );
  const source = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
      controller.close();
    },
  });
  const api = new ImagesApi(
    buildTransport(async () => new Response(source), undefined, () => {}),
  );
  const started = Promise.withResolvers<void>();
  const resume = Promise.withResolvers<void>();
  const progress: string[] = [];
  const pulling = api.pull({ reference: "alpine" }, async (report) => {
    if (report.stream !== undefined) progress.push(report.stream);
    started.resolve();
    await resume.promise;
  });
  await started.promise;
  assertEquals(progress, ["複製"]);
  resume.resolve();
  assertEquals(await pulling, { images: ["abc"] });
  assertEquals(progress, ["複製", "done"]);
});

for (
  const body of [
    "",
    '{"stream":"copying"}\n',
    '{"images":42}',
    '{"images":[1]}',
    '{"stream":false}',
    "null",
    '{"images":["abc"]}\nnot json',
  ]
) {
  Deno.test(`images.pull rejects incomplete or malformed report ${JSON.stringify(body)}`, async () => {
    await assertRejects(
      () => images(body).pull({ reference: "alpine" }),
      PodmanError,
    );
  });
}

Deno.test("images.pull rejects a report line over 1 MiB", async () => {
  const oversized = `{"stream":"${"x".repeat(1024 * 1024)}"}\n{"images":["a"]}`;
  const error = await assertRejects(
    () => images(oversized).pull({ reference: "alpine" }),
    PodmanError,
    "too long",
  );
  assertEquals(error.status, 200);
});

Deno.test("images.pull returns quiet success without invoking progress", async () => {
  let calls = 0;
  const report = await images('{"images":["abc"]}').pull({
    reference: "alpine",
    quiet: true,
  }, () => {
    calls++;
  });
  assertEquals(report, { images: ["abc"] });
  assertEquals(calls, 0);
});

Deno.test("images.pull rejects a streamed error after delivering progress", async () => {
  const progress: string[] = [];
  const api = images('{"stream":"copying"}\n{"error":"registry denied"}\n');
  const error = await assertRejects(
    () =>
      api.pull({ reference: "alpine" }, (report) => {
        if (report.stream !== undefined) progress.push(report.stream);
      }),
    PodmanError,
    "registry denied",
  );
  assertEquals(error.status, 200);
  assertEquals(progress, ["copying"]);
});

Deno.test("images.pull propagates callback failure and cancels the response", async () => {
  const cancelled = Promise.withResolvers<void>();
  const source = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"stream":"copying"}\n'));
    },
    cancel() {
      cancelled.resolve();
    },
  });
  const api = new ImagesApi(
    buildTransport(async () => new Response(source), undefined, () => {}),
  );
  const reason = new TypeError("consumer failed");
  const error = await assertRejects(
    () =>
      api.pull({ reference: "alpine" }, () => {
        throw reason;
      }),
    TypeError,
  );
  assertStrictEquals(error, reason);
  await cancelled.promise;
});

Deno.test("images.pull sends registry auth and outlives the ordinary deadline", async () => {
  const api = new ImagesApi(buildTransport(
    async (method, path, init) => {
      assertEquals([method, path, init?.headers?.["X-Registry-Auth"]], [
        "POST",
        "/images/pull?reference=alpine",
        "credentials",
      ]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      assertEquals(init?.signal?.aborted, false);
      return new Response('{"images":["abc"]}');
    },
    "credentials",
    () => {},
    { timeout: 0 },
  ));
  assertEquals(await api.pull({ reference: "alpine" }), { images: ["abc"] });
});

for (const action of ["abort", "close"] as const) {
  Deno.test(`images.pull rejects a pending stream when scoped ${action} occurs`, async () => {
    const controller = new AbortController();
    const started = Promise.withResolvers<void>();
    const transport = buildTransport(
      async (_method, _path, init) => {
        const body = new ReadableStream<Uint8Array>({
          start(stream) {
            init?.signal?.addEventListener(
              "abort",
              () => stream.error(init.signal?.reason),
              { once: true },
            );
            stream.enqueue(new TextEncoder().encode('{"stream":"copying"}\n'));
          },
        });
        return new Response(body);
      },
      undefined,
      () => {},
      { signal: controller.signal },
    );
    const pulling = new ImagesApi(transport).pull(
      { reference: "alpine" },
      () => {
        started.resolve();
      },
    );
    await started.promise;
    if (action === "abort") controller.abort();
    else transport.close();
    await assertRejects(() => pulling, DOMException);
  });
}

Deno.test("images.pull propagates HTTP stream errors", async () => {
  const api = new ImagesApi(
    buildTransport(
      async () =>
        new Response('{"message":"registry unavailable"}', { status: 503 }),
      undefined,
      () => {},
    ),
  );
  const error = await assertRejects(
    () => api.pull({ reference: "alpine" }),
    PodmanError,
    "registry unavailable",
  );
  assertEquals(error.status, 503);
});

Deno.test("images.buildLocal uses the deadline-free stream request", async () => {
  const api = new ImagesApi(buildTransport(
    async (_method, _path, init) => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      assertEquals(init?.signal?.aborted, false);
      return new Response("built");
    },
    undefined,
    () => {},
    { timeout: 0 },
  ));
  const stream = await api.buildLocal({ localcontextdir: "/context" });
  assertEquals(await new Response(stream).text(), "built");
});

Deno.test("images.buildLocal preserves HTTP stream error details", async () => {
  const api = new ImagesApi(buildTransport(
    async () => new Response('{"message":"build failed"}', { status: 500 }),
    undefined,
    () => {},
  ));
  const error = await assertRejects(
    () => api.buildLocal({ localcontextdir: "/context" }),
    PodmanError,
    "build failed",
  );
  assertEquals([error.status, error.method, error.path], [
    500,
    "POST",
    "/local/build?localcontextdir=%2Fcontext&outputformat=application%2Fvnd.oci.image.manifest.v1%2Bjson",
  ]);
});
