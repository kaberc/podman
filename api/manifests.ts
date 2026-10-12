import type { Transport } from "../transport.ts";
import { createPodmanError } from "../types/errors.ts";
import { readManifestPush } from "../internal/manifest-push.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  IDResponse,
  ImageRemoveReport,
  ManifestCreateQuery,
  ManifestInspectQuery,
  ManifestModifyOptions,
  ManifestModifyQuery,
  ManifestModifyReport,
  ManifestPushQuery,
  ManifestRemoveQuery,
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
    if (status !== 200 && status !== 201) {
      throw createPodmanError(status, json, "POST", path);
    }
    return json as IDResponse;
  }

  /** Inspect a manifest list. Returns null if not found. */
  async inspect(
    nameOrId: string,
    query?: ManifestInspectQuery,
  ): Promise<Schema2ListPublic | null> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}/json${
      buildQuery(query)
    }`;
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
    const path = `/manifests/${encodeURIComponent(nameOrId)}${
      buildQuery(query)
    }`;
    const { status, json } = await this.#t.request("PUT", path, opts);
    if (status !== 200) throw createPodmanError(status, json, "PUT", path);
    return json as ManifestModifyReport;
  }

  /** Delete a manifest list. */
  async remove(
    nameOrId: string,
    query?: ManifestRemoveQuery,
  ): Promise<ImageRemoveReport | null> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}${
      buildQuery(query)
    }`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ImageRemoveReport;
  }

  /** Push a manifest list to a registry. */
  async push(
    nameOrId: string,
    destination: string,
    query?: ManifestPushQuery,
  ): Promise<IDResponse> {
    const path = `/manifests/${encodeURIComponent(nameOrId)}/registry/${
      encodeURIComponent(destination)
    }${buildQuery(query)}`;
    const authHeader = this.#t.getAuthHeader();
    const stream = await this.#t.requestStream(
      "POST",
      path,
      undefined,
      authHeader ? { "X-Registry-Auth": authHeader } : {},
    );
    return await readManifestPush(stream, path);
  }
}
