import * as http from "node:http";
import * as https from "node:https";
import {
  type AuthOption,
  buildTransport,
  type DoFetchFn,
  type Transport,
} from "../transport_core.ts";

export type {
  DoFetchFn,
  DoFetchInit,
  Transport,
  TransportResponse,
} from "../transport_core.ts";

// ─── Node http.request → web Response adapter ────────────────────────────────

function nodeRequest(
  url: string,
  options: http.RequestOptions,
  body?: BodyInit,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https:");
    const requester = isHttps ? https.request : http.request;

    const req = requester(url, options, (res) => {
      const readable = new ReadableStream<Uint8Array>({
        start(controller) {
          res.on("data", (chunk: Buffer) =>
            controller.enqueue(new Uint8Array(chunk)));
          res.on("end", () => controller.close());
          res.on("error", (err) => controller.error(err));
        },
        cancel() {
          res.destroy();
        },
      });

      const headers = new Headers();
      for (const [key, value] of Object.entries(res.headers)) {
        if (value !== undefined) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      resolve(new Response(readable, { status: res.statusCode ?? 0, headers }));
    });

    req.on("error", reject);

    if (body !== undefined && body !== null) {
      if (typeof body === "string") {
        req.end(body);
        return;
      }
      if (body instanceof ArrayBuffer) {
        req.end(Buffer.from(body));
        return;
      }
      if (body instanceof Uint8Array) {
        req.end(Buffer.from(body.buffer, body.byteOffset, body.byteLength));
        return;
      }
      if (body instanceof ReadableStream) {
        const reader = body.getReader();
        (function pump() {
          reader.read().then(({ done, value }) => {
            if (done) {
              req.end();
              return;
            }
            req.write(Buffer.from(value));
            pump();
          }).catch((err) => {
            req.destroy(err);
            reject(err);
          });
        })();
        return;
      }
    }

    req.end();
  });
}

// ─── Unix socket transport ───────────────────────────────────────────────────

export interface TransportOptions {
  socketPath: string;
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
}

export function createTransport(opts: TransportOptions): Transport {
  const { socketPath, apiVersion = "4.0.0", timeout = 30_000 } = opts;
  const authHeader = opts.auth ? btoa(JSON.stringify(opts.auth)) : undefined;
  const base = `/v${apiVersion}/libpod`;

  const doFetch: DoFetchFn = async (method, path, init) => {
    const signal = init?.signal !== undefined
      ? (init.signal ?? undefined)
      : AbortSignal.timeout(timeout);

    return await nodeRequest(
      `http://localhost${base}${path}`,
      {
        socketPath,
        method,
        headers: init?.headers,
        signal: signal ?? undefined,
      },
      init?.body,
    );
  };

  return buildTransport(doFetch, authHeader, () => {});
}

// ─── TCP / TLS transport ─────────────────────────────────────────────────────

export interface TlsOptions {
  caCerts?: string[];
  cert?: string;
  key?: string;
}

export interface TcpTransportOptions {
  uri: string;
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
  tls?: TlsOptions;
}

export function createTcpTransport(opts: TcpTransportOptions): Transport {
  const { uri, apiVersion = "4.0.0", timeout = 30_000 } = opts;
  const authHeader = opts.auth ? btoa(JSON.stringify(opts.auth)) : undefined;
  const base = `${uri.replace(/\/+$/, "")}/v${apiVersion}/libpod`;

  let agent: https.Agent | undefined;
  if (opts.tls) {
    agent = new https.Agent({
      ca: opts.tls.caCerts?.join("\n"),
      cert: opts.tls.cert,
      key: opts.tls.key,
    });
  }

  const doFetch: DoFetchFn = async (method, path, init) => {
    const signal = init?.signal !== undefined
      ? (init.signal ?? undefined)
      : AbortSignal.timeout(timeout);

    if (agent) {
      return await nodeRequest(
        `${base}${path}`,
        {
          method,
          headers: init?.headers,
          agent,
          signal: signal ?? undefined,
        },
        init?.body,
      );
    }

    return await fetch(`${base}${path}`, {
      method,
      headers: init?.headers,
      body: init?.body,
      signal,
    });
  };

  return buildTransport(doFetch, authHeader, () => agent?.destroy());
}
