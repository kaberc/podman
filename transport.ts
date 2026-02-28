/**
 * Deno-specific transports for the Podman client.
 *
 * - **Unix socket** — `Deno.createHttpClient` with Unix socket proxy
 * - **TCP / TLS** — `fetch()` with optional `Deno.createHttpClient` for custom certs
 */

import {
  type AuthOption,
  buildTransport,
  type DoFetchFn,
  type Transport,
} from "./transport_core.ts";

export type {
  DoFetchFn,
  DoFetchInit,
  Transport,
  TransportResponse,
} from "./transport_core.ts";

// ─── Unix socket transport ───────────────────────────────────────────────────

export interface TransportOptions {
  socketPath: string;
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
}

export function createTransport(opts: TransportOptions): Transport {
  const { socketPath, apiVersion = "4.0.0", timeout = 30_000 } = opts;

  const client = Deno.createHttpClient({
    proxy: { transport: "unix", path: socketPath },
  });
  const authHeader = opts.auth ? btoa(JSON.stringify(opts.auth)) : undefined;
  const base = `http://localhost/v${apiVersion}/libpod`;

  const doFetch: DoFetchFn = async (method, path, init) => {
    const signal = init?.signal !== undefined
      ? (init.signal ?? undefined)
      : AbortSignal.timeout(timeout);
    return await fetch(`${base}${path}`, {
      method,
      headers: init?.headers,
      client,
      body: init?.body,
      signal,
    });
  };

  return buildTransport(doFetch, authHeader, () => client.close());
}

// ─── TCP / TLS transport ─────────────────────────────────────────────────────

export interface TlsOptions {
  /** PEM-encoded CA certificates for verifying the server. */
  caCerts?: string[];
  /** PEM-encoded client certificate chain (for mTLS). */
  cert?: string;
  /** PEM-encoded client private key (for mTLS). */
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

  const client = opts.tls
    ? Deno.createHttpClient({
        caCerts: opts.tls.caCerts,
        cert: opts.tls.cert,
        key: opts.tls.key,
      })
    : undefined;

  const doFetch: DoFetchFn = async (method, path, init) => {
    const signal = init?.signal !== undefined
      ? (init.signal ?? undefined)
      : AbortSignal.timeout(timeout);
    return await fetch(`${base}${path}`, {
      method,
      headers: init?.headers,
      body: init?.body,
      signal,
      ...(client ? { client } : {}),
    });
  };

  return buildTransport(doFetch, authHeader, () => client?.close());
}
