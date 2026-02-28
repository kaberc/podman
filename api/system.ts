import type { Transport } from "../transport.ts";
import { createPodmanError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  LibpodInfo,
  SystemComponentVersion,
  SystemDfReport,
  SystemCheckQuery,
  SystemCheckReport,
  SystemEventsQuery,
  SystemPruneReport,
} from "../types/api.ts";


export class SystemApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Return information about the Podman host. */
  async info(): Promise<LibpodInfo> {
    const path = "/info";
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as LibpodInfo;
  }

  /** Return component version information for the Podman service. */
  async version(): Promise<SystemComponentVersion> {
    const path = "/version";
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as SystemComponentVersion;
  }

  /** Ping the Podman service. Returns `true` if reachable. */
  async ping(): Promise<boolean> {
    // /_ping returns plain text "OK", not JSON — use requestRaw
    const res = await this.#t.requestRaw("GET", "/_ping");
    await res.body?.cancel();
    return res.status === 200;
  }

  /** Prune unused data (containers, images, volumes, networks). */
  async prune(): Promise<SystemPruneReport> {
    const path = "/system/prune";
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as SystemPruneReport;
  }

  /** Return disk usage information (containers, images, volumes). */
  async df(): Promise<SystemDfReport> {
    const path = "/system/df";
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as SystemDfReport;
  }

  /** Stream system events as raw bytes. */
  async events(
    query?: SystemEventsQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/events${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** Stream system events as parsed JSON objects. */
  async *parsedEvents(
    query?: SystemEventsQuery,
  ): AsyncGenerator<Record<string, unknown>> {
    const stream = await this.events(query);
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            try {
              yield JSON.parse(trimmed) as Record<string, unknown>;
            } catch {
              // Skip malformed JSON lines (e.g. truncated stream)
            }
          }
        }
      }
      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer.trim()) as Record<string, unknown>;
        } catch {
          // Skip malformed trailing data
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /** Run a consistency check on container storage. */
  async check(query?: SystemCheckQuery): Promise<SystemCheckReport> {
    const path = `/system/check${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as SystemCheckReport;
  }
}
