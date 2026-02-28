import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  IDResponse,
  ImageRemoveReport,
  ManifestCreateQuery,
  ManifestRemoveQuery,
  ManifestInspectQuery,
  ManifestModifyOptions,
  ManifestModifyQuery,
  ManifestModifyReport,
  ManifestPushQuery,
  Schema2ListPublic,
} from "../types/api.ts";


export class ManifestsApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a manifest list. */
  async create(
    name: string,
    query: ManifestCreateQuery,
    opts?: ManifestModifyOptions,
  ): Promise<IDResponse> {
    const path = `/manifests/${encodeURIComponent(name)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path, opts);
    if (status !== 200 && status !== 201) throw createPodmanError(status, json, "POST", path);
    return json as IDResponse;
  }

  /** Inspect a manifest list. Returns null if not found. */
  async inspect(
    nameOrId: string,
    query?: ManifestInspectQuery,
  ): Promise<Schema2ListPublic | null> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as Schema2ListPublic;
  }

  /** Check if a manifest list exists. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Modify a manifest list (add/remove/annotate). */
  async modify(
    nameOrId: string,
    opts: ManifestModifyOptions,
    query?: ManifestModifyQuery,
  ): Promise<ManifestModifyReport> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("PUT", path, opts);
    if (status !== 200) throw createPodmanError(status, json, "PUT", path);
    return json as ManifestModifyReport;
  }

  /** Delete a manifest list. */
  async remove(
    nameOrId: string,
    query?: ManifestRemoveQuery,
  ): Promise<ImageRemoveReport> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ImageRemoveReport;
  }

  /** Push a manifest list to a registry. */
  async push(
    nameOrId: string,
    destination: string,
    query?: ManifestPushQuery,
  ): Promise<IDResponse> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}/push/${encodeURIComponent(destination)}${buildQuery(query)}`;
    const headers: Record<string, string> = {};
    const authHeader = this.#t.getAuthHeader();
    if (authHeader) headers["X-Registry-Auth"] = authHeader;
    const res = await this.#t.requestRaw("POST", path, undefined, headers);
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as IDResponse;
  }
}
