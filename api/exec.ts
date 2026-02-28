import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  ExecCreateConfig,
  ExecResizeQuery,
  ExecStartConfig,
  InspectExecSession,
} from "../types/api.ts";

export class ExecApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create an exec session inside a container. Returns the exec session ID. */
  async create(nameOrId: string, config: ExecCreateConfig): Promise<string> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/exec`;
    const res = await this.#t.requestRaw("POST", path, JSON.stringify(config), {
      "Content-Type": "application/json",
    });
    if (res.status !== 201) await throwRawError(res, "POST", path);
    const result = await res.json();
    return (result as { Id: string }).Id;
  }

  /** Start an exec session and stream its output. */
  async start(
    id: string,
    config?: ExecStartConfig,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/exec/${encodeURIComponent(id)}/start`;
    const res = await this.#t.requestRaw(
      "POST",
      path,
      JSON.stringify(config ?? {}),
      { "Content-Type": "application/json" },
    );
    if (res.status >= 400) await throwRawError(res, "POST", path);
    if (!res.body) {
      throw new Error(`No response body for POST ${path}`);
    }
    return res.body;
  }

  /** Inspect an exec session. */
  async inspect(id: string): Promise<InspectExecSession> {
    const path = `/exec/${encodeURIComponent(id)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as InspectExecSession;
  }

  /** Resize an exec session's TTY dimensions. */
  async resize(id: string, query: ExecResizeQuery): Promise<void> {
    const path =
      `/exec/${encodeURIComponent(id)}/resize${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
  }
}
