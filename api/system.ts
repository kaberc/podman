import type { Transport } from "../transport.ts";
import { createPodmanError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import { readJsonLines } from "../internal/json-lines.ts";
import type {
  LibpodInfo,
  SystemCheckQuery,
  SystemCheckReport,
  SystemComponentVersion,
  SystemDfReport,
  SystemEventsQuery,
  SystemPruneQuery,
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
  async prune(query?: SystemPruneQuery): Promise<SystemPruneReport> {
    const path = `/system/prune${buildQuery(query)}`;
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

  /** Stream parsed event objects; skip malformed records, reject lines over 1 MiB. */
  async *parsedEvents(
    query?: SystemEventsQuery,
  ): AsyncGenerator<Record<string, unknown>> {
    const stream = await this.events(query);
    for await (const value of readJsonLines(stream, { malformed: "skip" })) {
      if (
        typeof value === "object" && value !== null && !Array.isArray(value)
      ) {
        yield Object.fromEntries(Object.entries(value));
      }
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
