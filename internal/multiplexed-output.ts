export interface MultiplexedOutputOptions {
  readonly maxBytes: number;
  readonly signal?: AbortSignal;
}

export class PodmanStreamError extends Error {
  override readonly name = "PodmanStreamError";

  constructor(
    readonly reason: "frame" | "truncated" | "limit",
    message: string,
  ) {
    super(message);
  }
}

export async function collectMultiplexedOutput(
  stream: ReadableStream<Uint8Array>,
  options: MultiplexedOutputOptions,
): Promise<{ readonly stdout: string; readonly stderr: string }> {
  const { maxBytes, signal } = options;
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError("maxBytes must be a nonnegative safe integer");
  }

  const reader = stream.getReader();
  let cancellation: Promise<PromiseSettledResult<void>[]> | undefined;
  const abort = () => {
    cancellation = Promise.allSettled([reader.cancel(signal?.reason)]);
  };
  signal?.addEventListener("abort", abort, { once: true });

  const header = new Uint8Array(8);
  const view = new DataView(header.buffer);
  let headerBytes = 0;
  let remaining = 0;
  let totalBytes = 0;
  let channel: "stdout" | "stderr" = "stdout";
  // Each decoder retains incomplete UTF-8 independently across frames.
  const output = {
    stdout: { decoder: new TextDecoder(), text: "" },
    stderr: { decoder: new TextDecoder(), text: "" },
  };

  try {
    if (signal?.aborted) abort();
    signal?.throwIfAborted();
    while (true) {
      const chunk = await reader.read();
      signal?.throwIfAborted();
      if (chunk.done) {
        if (headerBytes !== 0 || remaining !== 0) {
          throw new PodmanStreamError(
            "truncated",
            "Incomplete multiplexed frame",
          );
        }
        return {
          stdout: output.stdout.text + output.stdout.decoder.decode(),
          stderr: output.stderr.text + output.stderr.decoder.decode(),
        };
      }

      let offset = 0;
      while (offset < chunk.value.length) {
        if (remaining === 0) {
          const size = Math.min(8 - headerBytes, chunk.value.length - offset);
          header.set(chunk.value.subarray(offset, offset + size), headerBytes);
          offset += size;
          headerBytes += size;
          if (headerBytes < 8) continue;

          switch (view.getUint8(0)) {
            case 1:
              channel = "stdout";
              break;
            case 2:
              channel = "stderr";
              break;
            default:
              throw new PodmanStreamError(
                "frame",
                "Unsupported multiplexed channel",
              );
          }
          if (view.getUint8(1) || view.getUint8(2) || view.getUint8(3)) {
            throw new PodmanStreamError(
              "frame",
              "Nonzero multiplexed reserved bytes",
            );
          }
          remaining = view.getUint32(4);
          if (remaining > maxBytes - totalBytes) {
            throw new PodmanStreamError(
              "limit",
              "Multiplexed output exceeds maxBytes",
            );
          }
          totalBytes += remaining;
          headerBytes = 0;
        } else {
          const size = Math.min(remaining, chunk.value.length - offset);
          output[channel].text += output[channel].decoder.decode(
            chunk.value.subarray(offset, offset + size),
            { stream: true },
          );
          offset += size;
          remaining -= size;
        }
      }
    }
  } finally {
    signal?.removeEventListener("abort", abort);
    try {
      const results =
        await (cancellation ?? Promise.allSettled([reader.cancel()]));
      results.forEach((result) => {
        switch (result.status) {
          case "fulfilled":
            break;
          case "rejected":
            throw result.reason;
        }
      });
    } finally {
      reader.releaseLock();
    }
  }
}
