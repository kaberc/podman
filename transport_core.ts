/**
 * Shared transport types and builder used by both Deno and Node transports.
 *
 * Runtime-specific code (Unix sockets, TLS clients) lives in
 * `transport.ts` (Deno) or `_node/transport.ts` (Node).
 */

import { extractMessage, PodmanError } from "./types/errors.ts";

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
  signal?: AbortSignal | null;
}

export type DoFetchFn = (
  method: string,
  path: string,
  init?: DoFetchInit,
) => Promise<Response>;

// ─── Shared builder ──────────────────────────────────────────────────────────

export function buildTransport(
  doFetch: DoFetchFn,
  authHeader: string | undefined,
  closeFn: () => void,
): Transport {
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

      const res = await doFetch(method, path, {
        body: body !== undefined ? JSON.stringify(body) : undefined,
        headers,
      });

      const text = await res.text();
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
      return await doFetch(method, path, { body, headers });
    },

    async requestStream(
      method: string,
      path: string,
    ): Promise<ReadableStream<Uint8Array>> {
      const res = await doFetch(method, path, {
        headers: { "Accept": "application/json" },
        signal: null,
      });
      if (res.status >= 400) {
        const text = await res.text();
        let json: unknown = null;
        try {
          json = text.trim() ? JSON.parse(text) : null;
        } catch {
          // use raw text as message if JSON parse fails
        }
        throw new PodmanError({
          status: res.status,
          message: json
            ? extractMessage(json)
            : text || "Stream request failed",
          method,
          path,
        });
      }
      if (!res.body) {
        throw new Error(`No response body for ${method} ${path}`);
      }
      return res.body;
    },

    close: closeFn,
    getAuthHeader(): string | undefined {
      return authHeader;
    },
  };
}
