import * as http from "node:http";
import * as https from "node:https";
import { pipeline, Readable } from "node:stream";

type Payload =
  | { readonly kind: "none" }
  | { readonly kind: "bytes"; readonly data: string | Uint8Array }
  | {
    readonly kind: "stream";
    readonly stream: ReadableStream<Uint8Array>;
    readonly length?: number;
  };

function toPayload(body: BodyInit | null | undefined): Payload {
  if (body === undefined || body === null) return { kind: "none" };
  if (typeof body === "string") return { kind: "bytes", data: body };
  if (body instanceof ArrayBuffer) {
    return { kind: "bytes", data: new Uint8Array(body) };
  }
  if (ArrayBuffer.isView(body)) {
    return {
      kind: "bytes",
      data: new Uint8Array(body.buffer, body.byteOffset, body.byteLength),
    };
  }
  if (body instanceof ReadableStream) return { kind: "stream", stream: body };
  if (body instanceof Blob) {
    return { kind: "stream", stream: body.stream(), length: body.size };
  }
  throw new TypeError(
    `Unsupported request body type: ${
      Object.prototype.toString.call(body)
    }. Use string, ArrayBuffer, Uint8Array, Blob or ReadableStream.`,
  );
}

const NO_BODY_STATUS = new Set([204, 205, 304]);

/**
 * `http.request` as a web `fetch`-style call.
 *
 * `signal` is the only cancellation input (none: never cancelled): aborting it rejects a pending call
 * with `signal.reason`, errors the response body once headers arrived, and
 * cancels any streaming upload. The abort listener is removed as soon as the
 * response is closed or the call rejects.
 */
export function nodeRequest(
  url: string,
  options: Omit<http.RequestOptions, "headers" | "signal"> & {
    readonly headers?: Record<string, string>;
  },
  body: BodyInit | null | undefined,
  signal: AbortSignal | null | undefined,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const payload = toPayload(body);
    signal?.throwIfAborted();
    const uploadReader = payload.kind === "stream"
      ? payload.stream.getReader()
      : undefined;

    const headers: Record<string, string> = { ...options.headers };
    if (payload.kind === "stream" && payload.length !== undefined) {
      headers["content-length"] = String(payload.length);
    }
    const requester = url.startsWith("https:") ? https.request : http.request;
    let res: http.IncomingMessage | undefined;
    let responseController:
      | TransformStreamDefaultController<Uint8Array>
      | undefined;

    const stopListening = () => signal?.removeEventListener("abort", onAbort);
    const fail = (error: unknown) => {
      stopListening();
      reject(error);
      if (res) {
        responseController?.error(error);
        res.destroy(
          error instanceof Error
            ? error
            : new Error("Request aborted", { cause: error }),
        );
      }
      req.destroy();
    };
    const onAbort = () => fail(signal?.reason);

    let req: http.ClientRequest;
    try {
      req = requester(url, { ...options, headers }, (incoming) => {
        res = incoming;
        res.on("error", fail);
        res.on("close", () => {
          stopListening();
          if (!req.writableFinished) req.destroy();
        });
        try {
          const responseHeaders = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (value !== undefined) {
              responseHeaders.set(
                key,
                Array.isArray(value) ? value.join(", ") : value,
              );
            }
          }
          const status = res.statusCode ?? 0;
          let responseBody: ReadableStream<Uint8Array> | null = null;
          if (NO_BODY_STATUS.has(status) || options.method === "HEAD") {
            res.resume();
          } else {
            const bridge = new TransformStream<Uint8Array, Uint8Array>({
              start(controller) {
                responseController = controller;
              },
            });
            void Readable.toWeb(res, {
              strategy: new ByteLengthQueuingStrategy({
                highWaterMark: res.readableHighWaterMark,
              }),
            }).pipeTo(bridge.writable).catch(fail);
            responseBody = bridge.readable;
          }
          resolve(
            new Response(responseBody, { status, headers: responseHeaders }),
          );
        } catch (error) { // no-excuse-ok: catch — Reject callback failures through the request/body boundary.
          fail(error);
        }
      });
    } catch (error) { // no-excuse-ok: catch — Request construction has not transferred body ownership.
      uploadReader?.releaseLock();
      reject(error);
      return;
    }

    req.on("error", fail);
    signal?.addEventListener("abort", onAbort, { once: true });

    if (uploadReader) {
      const reader = uploadReader;
      const cancelUpload = () => {
        void reader.cancel(signal?.reason).catch(fail);
      };
      req.once("close", cancelUpload);
      const upload = Readable.from(
        (async function* () {
          try {
            while (true) {
              const chunk = await reader.read();
              if (chunk.done) return;
              yield chunk.value;
            }
          } finally {
            req.off("close", cancelUpload);
            try {
              await reader.cancel();
            } finally {
              reader.releaseLock();
            }
          }
        })(),
        { objectMode: false },
      );
      pipeline(upload, req, (error) => {
        if (error && !res?.complete) fail(error);
      });
    } else {
      req.end(payload.kind === "bytes" ? payload.data : undefined);
    }
  });
}
