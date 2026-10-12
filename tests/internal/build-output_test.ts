import { assertEquals, assertRejects } from "@std/assert";
import {
  type BuildReport,
  collectBuildOutput,
} from "../../internal/build-output.ts";
import { PodmanStreamError } from "../../internal/multiplexed-output.ts";
import { PodmanError } from "../../types/errors.ts";

function streamOf(...chunks: readonly Uint8Array[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

const bytes = (text: string) => new TextEncoder().encode(text);
const bytewise = (text: string) =>
  Array.from(bytes(text), (byte) => Uint8Array.of(byte));

Deno.test("decodes reports across split lines and UTF-8; empty stream succeeds", async () => {
  const seen: BuildReport[] = [];
  await collectBuildOutput(
    streamOf(
      ...bytewise(
        '{"stream":"€ step"}\n\n{"aux":{"ID":"sha256:1"}}\n{"stream":"😀"}',
      ),
    ),
    (report) => {
      seen.push(report);
    },
  );
  assertEquals(seen.map((r) => r.stream ?? r.aux?.ID), [
    "€ step",
    "sha256:1",
    "😀",
  ]);
  await collectBuildOutput(streamOf());
});

Deno.test("awaits the handler before reading further", async () => {
  const events: string[] = [];
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      events.push("pull");
      controller.enqueue(bytes('{"stream":"a"}\n'));
      controller.close();
    },
  }, { highWaterMark: 0 });
  await collectBuildOutput(stream, async () => {
    await Promise.resolve();
    events.push("report");
  });
  assertEquals(events, ["pull", "report"]);
});

Deno.test("delivers then rejects embedded errors with a typed PodmanError", async () => {
  for (
    const failure of [
      '{"error":"boom"}',
      '{"errorDetail":{"message":"boom"}}',
    ]
  ) {
    let delivered = 0;
    const error = await assertRejects(
      () =>
        collectBuildOutput(streamOf(bytes(`${failure}\n`)), () => {
          delivered++;
        }),
      PodmanError,
      "boom",
    );
    assertEquals(delivered, 1);
    assertEquals([error.status, error.method, error.path], [
      200,
      "POST",
      "/build",
    ]);
  }
});

Deno.test("rejects malformed, mistyped, truncated and over-long reports", async () => {
  for (
    const wire of ['{"stream":\n', "[]\n", '{"stream":1}\n', '{"stream":"x"']
  ) {
    await assertRejects(
      () => collectBuildOutput(streamOf(bytes(wire))),
      PodmanStreamError,
    );
  }
  await assertRejects(
    () => collectBuildOutput(streamOf(new Uint8Array(1024 * 1024 + 1))),
    PodmanStreamError,
    "too long",
  );
});

Deno.test("releases the stream and keeps the abort reason", async () => {
  const failed = streamOf(bytes("nope\n"));
  await assertRejects(() => collectBuildOutput(failed));
  assertEquals(failed.locked, false);

  const reason = new Error("aborted");
  const aborted = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.error(reason);
    },
  });
  const caught = await collectBuildOutput(aborted).catch((e: unknown) => e);
  assertEquals(caught, reason);
  assertEquals(aborted.locked, false);
});
