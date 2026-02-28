import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  ArtifactAddQuery,
  ArtifactAddReport,
  ArtifactRemoveAllQuery,
  ArtifactExtractQuery,
  ArtifactInspectReport,
  ArtifactListReport,
  ArtifactLocalQuery,
  ArtifactPullQuery,
  ArtifactPullReport,
  ArtifactPushQuery,
  ArtifactPushReport,
  ArtifactRemoveReport,
} from "../types/api.ts";


export class ArtifactsApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Remove a single artifact by name or ID. */
  async remove(nameOrId: string): Promise<ArtifactRemoveReport> {
    const path = `/artifacts/${encodeURIComponent(nameOrId)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ArtifactRemoveReport;
  }

  /** Extract an artifact's contents as a tar archive stream. */
  async extract(
    nameOrId: string,
    query?: ArtifactExtractQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path =
      `/artifacts/${encodeURIComponent(nameOrId)}/extract${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** Inspect an artifact. Returns `null` if not found. */
  async inspect(nameOrId: string): Promise<ArtifactInspectReport | null> {
    const path = `/artifacts/${encodeURIComponent(nameOrId)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as ArtifactInspectReport;
  }

  /** Push an artifact to a remote registry. */
  async push(
    nameOrId: string,
    query?: ArtifactPushQuery,
  ): Promise<ArtifactPushReport> {
    const path =
      `/artifacts/${encodeURIComponent(nameOrId)}/push${buildQuery(query)}`;
    const headers: Record<string, string> = {};
    const authHeader = this.#t.getAuthHeader();
    if (authHeader) headers["X-Registry-Auth"] = authHeader;
    const res = await this.#t.requestRaw("POST", path, undefined, headers);
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as ArtifactPushReport;
  }

  /** Add a file as a new artifact. */
  async add(
    body: ReadableStream<Uint8Array>,
    query: ArtifactAddQuery,
  ): Promise<ArtifactAddReport> {
    const path = `/artifacts/add${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/octet-stream",
    });
    if (res.status !== 201) await throwRawError(res, "POST", path);
    return (await res.json()) as ArtifactAddReport;
  }

  /** List all artifacts. */
  async list(): Promise<ArtifactListReport[]> {
    const path = "/artifacts/json";
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ArtifactListReport[];
  }

  /** Add a local file as an artifact. */
  async addLocal(query: ArtifactLocalQuery): Promise<ArtifactAddReport> {
    const path = `/artifacts/local/add${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
    return json as ArtifactAddReport;
  }

  /** Pull an artifact from a remote registry. */
  async pull(query: ArtifactPullQuery): Promise<ArtifactPullReport> {
    const path = `/artifacts/pull${buildQuery(query)}`;
    const headers: Record<string, string> = {};
    const authHeader = this.#t.getAuthHeader();
    if (authHeader) headers["X-Registry-Auth"] = authHeader;
    const res = await this.#t.requestRaw("POST", path, undefined, headers);
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as ArtifactPullReport;
  }

  /** Remove one or more artifacts. */
  async removeAll(query?: ArtifactRemoveAllQuery): Promise<ArtifactRemoveReport> {
    const path = `/artifacts/remove${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ArtifactRemoveReport;
  }
}
