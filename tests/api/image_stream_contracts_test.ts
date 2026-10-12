import { assertEquals, assertRejects } from "@std/assert";
import { ImagesApi } from "../../api/images.ts";
import { collectBuildOutput } from "../../internal/build-output.ts";
import { buildTransport } from "../../transport_core.ts";
import { PodmanError } from "../../types/errors.ts";

function images(wire: string, timeout?: number) {
  return new ImagesApi(buildTransport(
    async () => {
      await Promise.resolve();
      return new Response(wire);
    },
    undefined,
    () => {},
    { timeout },
  ));
}

Deno.test("native v6 pull preserves artifact progress and terminal status", async () => {
  // Given the v6 native artifact-progress wire contract.
  const progress = {
    status: "pulling",
    current: 1,
    total: -1,
    progressComponentID: "sha256:layer",
  };
  const api = images(
    JSON.stringify({
      status: "pulling",
      stream: "Pulling artifact",
      pullProgress: progress,
    }) + '\n{"status":"success","images":["image"]}\n',
  );
  const reports: unknown[] = [];
  // When requesting native progress.
  const result = await api.pull(
    { reference: "alpine", pullProgress: true },
    (report) => {
      reports.push(report);
    },
  );
  // Then artifact progress and native completion survive decoding.
  assertEquals(reports, [{
    status: "pulling",
    stream: "Pulling artifact",
    pullProgress: progress,
  }]);
  assertEquals(result, { status: "success", images: ["image"] });
});

Deno.test("native v6 pull delivers status-only progress before completion", async () => {
  // Given a status-only native progress frame.
  const api = images(
    '{"status":"pulling"}\n{"status":"success","images":["image"]}\n',
  );
  const reports: unknown[] = [];
  // When consuming the native stream.
  await api.pull({ reference: "alpine" }, (report) => {
    reports.push(report);
  });
  // Then progress is delivered without requiring legacy stream text.
  assertEquals(reports, [{ status: "pulling" }]);
});

Deno.test("compat pull consumes layer completion until EOF and awaits callbacks", async () => {
  // Given Docker layer IDs and a distinct final image ID.
  const api = images(
    '{"status":"Downloading","progressDetail":{"current":1,"total":2},"id":"layer"}\n' +
      '{"status":"Download complete","progressDetail":{},"id":"layer"}\n' +
      '{"status":"Download complete","progressDetail":{},"id":"image"}\n',
  );
  const delivered: string[] = [];
  // When consuming compatibility progress asynchronously.
  const result = await api.pull(
    { reference: "alpine", compatMode: true },
    async (report) => {
      await Promise.resolve();
      delivered.push(report.id ?? "");
    },
  );
  // Then no layer ID completes the pull prematurely.
  assertEquals(delivered, ["layer", "layer", "image"]);
  assertEquals<unknown>(result, {
    status: "Download complete",
    progressDetail: {},
    id: "image",
  });
});

Deno.test("compat pull rejects errorDetail following layer completion", async () => {
  // Given a layer completion followed by an embedded failure.
  const api = images(
    '{"status":"Download complete","id":"layer"}\n{"errorDetail":{"message":"registry denied"}}\n',
  );
  // When pulling in compatibility mode.
  const error = await assertRejects(
    () => api.pull({ reference: "alpine", compatMode: true }),
    PodmanError,
    "registry denied",
  );
  // Then the request identity and failure survive.
  assertEquals(error.path, "/images/pull?reference=alpine&compatMode=true");
});

for (const local of [false, true]) {
  Deno.test(`build collector derives ${local ? "local" : "tar"} request identity`, async () => {
    // Given an HTTP-success stream containing a build failure.
    const api = images('{"errorDetail":{"message":"build denied"}}\n');
    const stream = local
      ? await api.buildLocal({ localcontextdir: "/context", target: "stage" })
      : await api.build(
        new ReadableStream({
          start(c) {
            c.close();
          },
        }),
        { target: "stage" },
      );
    // When consuming through the public collector without path options.
    const error = await assertRejects(
      () => collectBuildOutput(stream),
      PodmanError,
      "build denied",
    );
    // Then it identifies the producer's complete endpoint.
    assertEquals(
      error.path,
      local
        ? "/local/build?localcontextdir=%2Fcontext&target=stage"
        : "/build?target=stage",
    );
  });
}

Deno.test("tar build uses the deadline-free stream request", async () => {
  // Given an expired ordinary request deadline.
  const api = images('{"stream":"built"}\n', 0);
  // When uploading a build context.
  const stream = await api.build(
    new ReadableStream({
      start(c) {
        c.close();
      },
    }),
  );
  // Then the build remains consumable.
  await collectBuildOutput(stream);
});

for (const failure of [false, true]) {
  Deno.test(`nonquiet push awaits ${failure ? "failure" : "success"} at stream completion`, async () => {
    // Given an HTTP-success response that has not completed the push.
    const started = Promise.withResolvers<void>();
    const finish = Promise.withResolvers<void>();
    const api = new ImagesApi(
      buildTransport(
        async () =>
          new Response(
            new ReadableStream<Uint8Array>({
              async start(c) {
                c.enqueue(new TextEncoder().encode('{"stream":"copying"}\n'));
                started.resolve();
                await finish.promise;
                c.enqueue(new TextEncoder().encode(
                  failure
                    ? '{"error":"push denied"}\n'
                    : '{"manifestdigest":"sha256:abc"}\n',
                ));
                c.close();
              },
            }),
          ),
        undefined,
        () => {},
      ),
    );
    let settled = false;
    // When pushing with progress enabled.
    const pushing = api.push("alpine", { quiet: false }).finally(() => {
      settled = true;
    });
    await started.promise;
    await Promise.resolve();
    // Then success cannot precede the terminal report.
    assertEquals(settled, false);
    finish.resolve();
    if (failure) await assertRejects(() => pushing, PodmanError, "push denied");
    else await pushing;
  });
}
