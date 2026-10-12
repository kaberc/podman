import { assertEquals, assertRejects } from "@std/assert";
import {
  collectMultiplexedOutput,
  PodmanStreamError,
} from "../../internal/multiplexed-output.ts";

function frame(channel: number, payload: readonly number[]): Uint8Array {
  const bytes = new Uint8Array(8 + payload.length);
  bytes[0] = channel;
  new DataView(bytes.buffer).setUint32(4, payload.length);
  bytes.set(payload, 8);
  return bytes;
}

function streamOf(
  ...chunks: readonly Uint8Array[]
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

Deno.test("collects channels and UTF-8 when headers and characters split", async () => {
  const wire = Uint8Array.from([
    ...frame(1, [0xe2]),
    ...frame(2, [0xf0, 0x9f]),
    ...frame(1, []),
    ...frame(1, [0x82, 0xac]),
    ...frame(2, [0x98, 0x80]),
  ]);
  const stream = streamOf(
    new Uint8Array(),
    ...Array.from(wire, (byte) => Uint8Array.of(byte)),
  );
  const result = await collectMultiplexedOutput(stream, { maxBytes: 7 });
  assertEquals(result, { stdout: "€", stderr: "😀" });
  assertEquals(stream.locked, false);
});

Deno.test("collects coalesced frames at the exact combined byte limit", async () => {
  const stream = streamOf(Uint8Array.from([
    ...frame(1, [65, 66]),
    ...frame(2, [67]),
    ...frame(1, [68]),
  ]));
  const result = await collectMultiplexedOutput(stream, { maxBytes: 4 });
  assertEquals(result, { stdout: "ABD", stderr: "C" });
});

Deno.test("allows empty output and zero frames when maxBytes is zero", async () => {
  const result = await collectMultiplexedOutput(
    streamOf(frame(1, []), frame(2, [])),
    { maxBytes: 0 },
  );
  assertEquals(result, { stdout: "", stderr: "" });
});

for (const channel of [0, 3, 255]) {
  Deno.test(`rejects unsupported channel ${channel}`, async () => {
    const error = await assertRejects(
      () =>
        collectMultiplexedOutput(streamOf(frame(channel, [])), { maxBytes: 0 }),
      PodmanStreamError,
    );
    assertEquals(error.reason, "frame");
  });
}

for (const reserved of [1, 2, 3]) {
  Deno.test(`rejects nonzero reserved byte ${reserved}`, async () => {
    const bytes = frame(1, []);
    bytes[reserved] = 1;
    const error = await assertRejects(
      () => collectMultiplexedOutput(streamOf(bytes), { maxBytes: 0 }),
      PodmanStreamError,
    );
    assertEquals(error.reason, "frame");
  });
}

for (
  const bytes of [frame(1, []).subarray(0, 7), frame(2, [65]).subarray(0, 8)]
) {
  Deno.test(`rejects truncated ${bytes.length === 7 ? "header" : "body"}`, async () => {
    const stream = streamOf(bytes);
    const error = await assertRejects(
      () => collectMultiplexedOutput(stream, { maxBytes: 1 }),
      PodmanStreamError,
    );
    assertEquals(error.reason, "truncated");
    assertEquals(stream.locked, false);
  });
}

Deno.test("rejects oversized announced payload before EOF or allocation", async () => {
  const header = Uint8Array.of(1, 0, 0, 0, 255, 255, 255, 255);
  const error = await assertRejects(
    () =>
      collectMultiplexedOutput(streamOf(header), { maxBytes: 4 * 1024 * 1024 }),
    PodmanStreamError,
  );
  assertEquals(error.reason, "limit");
});

Deno.test("limits the combined channels even when stdout is a valid digest", async () => {
  const digest = new TextEncoder().encode(`sha256:${"a".repeat(64)}`);
  const error = await assertRejects(
    () =>
      collectMultiplexedOutput(
        streamOf(frame(1, [...digest]), frame(2, [33])),
        {
          maxBytes: digest.length,
        },
      ),
    PodmanStreamError,
  );
  assertEquals(error.reason, "limit");
});

for (const maxBytes of [-1, 0.5, NaN, Infinity]) {
  Deno.test(`rejects invalid maxBytes ${maxBytes}`, async () => {
    await assertRejects(
      () => collectMultiplexedOutput(streamOf(), { maxBytes }),
      RangeError,
    );
  });
}

Deno.test("propagates pre-abort reason and cancels the owned reader", async () => {
  const reason = new Error("stop");
  let cancelled: unknown;
  const stream = new ReadableStream<Uint8Array>({
    cancel(value) {
      cancelled = value;
    },
  });
  const signal = AbortSignal.abort(reason);
  const error = await assertRejects(() =>
    collectMultiplexedOutput(stream, { maxBytes: 0, signal })
  );
  assertEquals(error, reason);
  assertEquals(cancelled, reason);
  assertEquals(stream.locked, false);
});

Deno.test("aborting a blocked read waits for cancellation and rejects, not EOF", async () => {
  const controller = new AbortController();
  const reason = new Error("blocked read stopped");
  const started = Promise.withResolvers<void>();
  const cancelled = Promise.withResolvers<unknown>();
  const cleanup = Promise.withResolvers<void>();
  const stream = new ReadableStream<Uint8Array>({
    pull() {
      started.resolve();
    },
    cancel(value) {
      cancelled.resolve(value);
      return cleanup.promise;
    },
  });
  const result = collectMultiplexedOutput(stream, {
    maxBytes: 1,
    signal: controller.signal,
  });
  const rejection = assertRejects(() => result);
  await started.promise;
  controller.abort(reason);
  assertEquals(await cancelled.promise, reason);
  assertEquals(stream.locked, true);
  cleanup.resolve();
  assertEquals(await rejection, reason);
  assertEquals(stream.locked, false);
});

Deno.test("propagates unknown source failures unchanged", async () => {
  const reason = new TypeError("source failed");
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.error(reason);
    },
  });
  const error = await assertRejects(() =>
    collectMultiplexedOutput(stream, { maxBytes: 1 })
  );
  assertEquals(error, reason);
  assertEquals(stream.locked, false);
});

Deno.test("propagates cancellation failure and still releases the reader", async () => {
  const reason = new TypeError("cleanup failed");
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(frame(3, []));
    },
    cancel() {
      return Promise.reject(reason);
    },
  });
  const error = await assertRejects(() =>
    collectMultiplexedOutput(stream, { maxBytes: 0 })
  );
  assertEquals(error, reason);
  assertEquals(stream.locked, false);
});
