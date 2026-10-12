/**
 * Shared transport types and builder used by both Deno and Node transports.
 *
 * Runtime-specific code (Unix sockets, TLS clients) lives in
 * `transport.ts` (Deno) or `_node/transport.ts` (Node).
 */

import { releaseOnEnd, TransportLifetime } from "./internal/lifetime.ts";
import { createPodmanError, PodmanError } from "./types/errors.ts";

// ─── Public interfaces ───────────────────────────────────────────────────────

export interface TransportResponse {
  status: number;
  json: unknown;
}

export interface Transport {
  request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<TransportResponse>;

  requestRaw(
    method: string,
    path: string,
    body?: BodyInit,
    headers?: Record<string, string>,
  ): Promise<Response>;

  requestStream(
    method: string,
    path: string,
    body?: BodyInit,
    headers?: Record<string, string>,
  ): Promise<ReadableStream<Uint8Array>>;

  getAuthHeader(): string | undefined;
  close(): void;
}

// ─── Shared types ────────────────────────────────────────────────────────────

export type AuthOption =
  | { username: string; password: string }
  | { identityToken: string };

export interface DoFetchInit {
  body?: BodyInit;
  headers?: Record<string, string>;
  /** Always set by `buildTransport`: lifetime, caller and timeout combined. */
  signal?: AbortSignal | null;
}

export interface TransportPolicy {
  /** Closes the transport when aborted, cancelling every request in flight. */
  signal?: AbortSignal;
  /** Ordinary request timeout in ms; null leaves the client signal in control. */
  timeout?: number | null;
}

export type DoFetchFn = (
  method: string,
  path: string,
  init?: DoFetchInit,
) => Promise<Response>;

/**
 * `new Response` cannot carry `url`, `redirected` or `type`; copy them from the
 * native response, including onto clones.
 */
function withNativeMetadata(wrapped: Response, native: Response): Response {
  const { url, redirected, type } = native;
  Object.defineProperties(wrapped, {
    url: { value: url },
    redirected: { value: redirected },
    type: { value: type },
    clone: {
      value: () =>
        withNativeMetadata(Response.prototype.clone.call(wrapped), native),
    },
  });
  return wrapped;
}

// ─── Shared builder ──────────────────────────────────────────────────────────

export function buildTransport(
  doFetch: DoFetchFn,
  authHeader: string | undefined,
  closeFn: () => void,
  policy: TransportPolicy = {},
): Transport {
  const { signal, timeout = 30_000 } = policy;
  const lifetime = new TransportLifetime(closeFn, signal);

  return {
    async request(
      method: string,
      path: string,
      body?: unknown,
    ): Promise<TransportResponse> {
      const headers: Record<string, string> = {
        "Accept": "application/json",
      };
      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
      }

      const scope = lifetime.scope(timeout);
      let text: string;
      let res: Response;
      try {
        res = await doFetch(method, path, {
          body: body !== undefined ? JSON.stringify(body) : undefined,
          headers,
          signal: scope.signal,
        });
        text = await res.text();
      } finally {
        scope.release();
      }
      let json: unknown = null;
      if (text.trim()) {
        try {
          json = JSON.parse(text);
        } catch {
          throw new PodmanError({
            status: res.status,
            message: `Invalid JSON response: ${text.slice(0, 200)}`,
            method,
            path,
          });
        }
      }
      return { status: res.status, json };
    },

    async requestRaw(
      method: string,
      path: string,
      body?: BodyInit,
      headers?: Record<string, string>,
    ): Promise<Response> {
      const scope = lifetime.scope(timeout);
      try {
        const res = await doFetch(method, path, {
          body,
          headers,
          signal: scope.signal,
        });
        if (!res.body) {
          scope.release();
          return res;
        }
        return withNativeMetadata(
          new Response(releaseOnEnd(res.body, scope.release), res),
          res,
        );
      } catch (error) {
        scope.release();
        throw error;
      }
    },

    async requestStream(
      method: string,
      path: string,
      body?: BodyInit,
      headers?: Record<string, string>,
    ): Promise<ReadableStream<Uint8Array>> {
      const scope = lifetime.scope(null);
      try {
        const res = await doFetch(method, path, {
          body,
          headers: { "Accept": "application/json", ...headers },
          signal: scope.signal,
        });
        if (res.status >= 400) {
          const text = await res.text();
          let json: unknown = null;
          try {
            json = text.trim() ? JSON.parse(text) : null;
          } catch (error) {
            if (!(error instanceof SyntaxError)) throw error;
          }
          throw createPodmanError(
            res.status,
            json ? json : { message: text || "Stream request failed" },
            method,
            path,
          );
        }
        if (!res.body) {
          throw new Error(`No response body for ${method} ${path}`);
        }
        return releaseOnEnd(res.body, scope.release);
      } catch (error) {
        scope.release();
        throw error;
      }
    },

    close: () => lifetime.close(),
    getAuthHeader(): string | undefined {
      return authHeader;
    },
  };
}
