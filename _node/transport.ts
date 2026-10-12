import * as https from "node:https";
import { nodeRequest } from "./node-request.ts";
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

// ─── Unix socket transport ───────────────────────────────────────────────────

export interface TransportOptions {
  socketPath: string;
  apiVersion?: string;
  timeout?: number | null;
  auth?: AuthOption;
  /** Aborting closes the transport and cancels every request in flight. */
  signal?: AbortSignal;
}

export function createTransport(opts: TransportOptions): Transport {
  const { socketPath, apiVersion = "4.0.0", timeout = 30_000 } = opts;
  const authHeader = opts.auth ? btoa(JSON.stringify(opts.auth)) : undefined;
  const base = `/v${apiVersion}/libpod`;

  const doFetch: DoFetchFn = async (method, path, init) => {
    return await nodeRequest(
      `http://localhost${base}${path}`,
      { socketPath, method, headers: init?.headers },
      init?.body,
      init?.signal,
    );
  };

  return buildTransport(doFetch, authHeader, () => {}, {
    signal: opts.signal,
    timeout,
  });
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
  timeout?: number | null;
  auth?: AuthOption;
  tls?: TlsOptions;
  /** Aborting closes the transport and cancels every request in flight. */
  signal?: AbortSignal;
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
    if (agent) {
      return await nodeRequest(
        `${base}${path}`,
        { method, headers: init?.headers, agent },
        init?.body,
        init?.signal,
      );
    }

    const request: RequestInit & { readonly duplex?: "half" } = {
      method,
      headers: init?.headers,
      body: init?.body,
      signal: init?.signal,
      ...(init?.body instanceof ReadableStream ? { duplex: "half" } : {}),
    };
    return await fetch(`${base}${path}`, request);
  };

  return buildTransport(doFetch, authHeader, () => agent?.destroy(), {
    signal: opts.signal,
    timeout,
  });
}
