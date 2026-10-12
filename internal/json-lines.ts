import { PodmanStreamError } from "./multiplexed-output.ts";

const MAX_LINE_BYTES = 1024 * 1024;
const NEWLINE = 0x0a;

function parseLine(line: Uint8Array, malformed: "reject" | "skip"): unknown {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(line);
    return text.trim() ? JSON.parse(text) : undefined;
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      if (malformed === "skip") return undefined;
      throw new PodmanStreamError("frame", "Malformed JSON line");
    }
    throw error;
  }
}

/**
 * Yield each non-blank JSON value of an NDJSON stream. A line, including the
 * last, may hold at most 1 MiB. Rejects with {@link PodmanStreamError}
 * ("frame" for invalid UTF-8 or JSON, "limit" for an oversized line). The
 * stream is cancelled and released however iteration ends.
 */
export async function* readJsonLines(
  stream: ReadableStream<Uint8Array>,
  { malformed = "reject" }: { readonly malformed?: "reject" | "skip" } = {},
): AsyncGenerator<unknown> {
  const reader = stream.getReader();
  let parts: Uint8Array[] = [];
  let size = 0;

  const takeLine = (): Uint8Array => {
    const line = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      line.set(part, offset);
      offset += part.length;
    }
    parts = [];
    size = 0;
    return line;
  };

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        const value = parseLine(takeLine(), malformed);
        if (value !== undefined) yield value;
        return;
      }
      let start = 0;
      while (start < chunk.value.length) {
        const end = chunk.value.indexOf(NEWLINE, start);
        const stop = end === -1 ? chunk.value.length : end;
        size += stop - start;
        if (size > MAX_LINE_BYTES) {
          throw new PodmanStreamError("limit", "JSON line too long");
        }
        parts.push(chunk.value.subarray(start, stop));
        if (end === -1) break;
        const value = parseLine(takeLine(), malformed);
        if (value !== undefined) yield value;
        start = end + 1;
      }
    }
  } finally {
    try {
      await reader.cancel();
    } finally {
      reader.releaseLock();
    }
  }
}
