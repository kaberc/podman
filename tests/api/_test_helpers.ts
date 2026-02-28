import type { Transport, TransportResponse } from "../../transport.ts";

export function mockTransport(
  handler: (method: string, path: string, body?: unknown) => TransportResponse,
  opts?: {
    requestRaw?: (
      method: string,
      path: string,
      body?: BodyInit,
      headers?: Record<string, string>,
    ) => Promise<Response>;
    requestStream?: (
      method: string,
      path: string,
    ) => Promise<ReadableStream<Uint8Array>>;
  },
): Transport {
  return {
    request(method: string, path: string, body?: unknown) {
      return Promise.resolve(handler(method, path, body));
    },
    requestRaw(
      method: string,
      path: string,
      body?: BodyInit,
      headers?: Record<string, string>,
    ) {
      if (opts?.requestRaw) return opts.requestRaw(method, path, body, headers);
      return Promise.resolve(new Response(null, { status: 200 }));
    },
    requestStream(method: string, path: string) {
      if (opts?.requestStream) return opts.requestStream(method, path);
      return Promise.resolve(new ReadableStream<Uint8Array>());
    },
    close() {},
    getAuthHeader() { return undefined; },
  };
}
