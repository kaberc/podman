import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  VolumeConfigResponse,
  VolumeCreateOptions,
  VolumeRemoveQuery,
  VolumeListQuery,
  VolumePruneQuery,
  VolumePruneReport,
} from "../types/api.ts";

export class VolumesApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a new volume. */
  async create(opts: VolumeCreateOptions): Promise<VolumeConfigResponse> {
    const path = "/volumes/create";
    const { status, json } = await this.#t.request("POST", path, opts);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
    return json as VolumeConfigResponse;
  }

  /** Inspect a volume. Returns `null` if the volume is not found. */
  async inspect(
    nameOrId: string,
  ): Promise<VolumeConfigResponse | null> {
    const path = `/volumes/${encodeURIComponent(nameOrId)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as VolumeConfigResponse;
  }

  /** List volumes, optionally filtered by the given query. */
  async list(query?: VolumeListQuery): Promise<VolumeConfigResponse[]> {
    const path = `/volumes/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as VolumeConfigResponse[];
  }

  /** Remove a volume. */
  async remove(
    nameOrId: string,
    query?: VolumeRemoveQuery,
  ): Promise<void> {
    const path =
      `/volumes/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 204) throw createPodmanError(status, json, "DELETE", path);
  }

  /** Check if a volume exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/volumes/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Remove unused volumes. Returns a list of pruned volumes. */
  async prune(query?: VolumePruneQuery): Promise<VolumePruneReport[]> {
    const path = `/volumes/prune${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return (json ?? []) as VolumePruneReport[];
  }

  /** Export a volume as a tar archive stream. */
  async export(nameOrId: string): Promise<ReadableStream<Uint8Array>> {
    const path = `/volumes/${encodeURIComponent(nameOrId)}/export`;
    return await this.#t.requestStream("GET", path);
  }

  /** Import a tar archive into a volume. */
  async import(
    nameOrId: string,
    body: ReadableStream<Uint8Array>,
  ): Promise<void> {
    const path = `/volumes/${encodeURIComponent(nameOrId)}/import`;
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status !== 204) await throwRawError(res, "POST", path);
  }
}
