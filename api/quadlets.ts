import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  ListQuadlet,
  QuadletRemoveAllQuery,
  QuadletRemoveQuery,
  QuadletInstallQuery,
  QuadletListQuery,
  QuadletRemoveReport,
} from "../types/api.ts";

export type QuadletInstallReport = {
  InstalledQuadlets?: Record<string, string>;
  QuadletErrors?: Record<string, string>;
};


export class QuadletsApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Install quadlet files from a tar archive. */
  async install(
    body: ReadableStream<Uint8Array>,
    query?: QuadletInstallQuery,
  ): Promise<QuadletInstallReport> {
    const path = `/quadlets${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as QuadletInstallReport;
  }

  /** Remove one or more quadlets. */
  async removeAll(query?: QuadletRemoveAllQuery): Promise<QuadletRemoveReport> {
    const path = `/quadlets${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as QuadletRemoveReport;
  }

  /** Remove a quadlet by name. */
  async remove(
    name: string,
    query?: QuadletRemoveQuery,
  ): Promise<QuadletRemoveReport> {
    const path =
      `/quadlets/${encodeURIComponent(name)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as QuadletRemoveReport;
  }

  /** Check if a quadlet exists. Returns `true` on 204, `false` otherwise. */
  async exists(name: string): Promise<boolean> {
    const path = `/quadlets/${encodeURIComponent(name)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Get the contents of a quadlet file. */
  async file(name: string): Promise<string> {
    const path = `/quadlets/${encodeURIComponent(name)}/file`;
    const res = await this.#t.requestRaw("GET", path);
    if (res.status !== 200) await throwRawError(res, "GET", path);
    return await res.text();
  }

  /** List all quadlets. */
  async list(query?: QuadletListQuery): Promise<ListQuadlet[]> {
    const path = `/quadlets/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ListQuadlet[];
  }
}
