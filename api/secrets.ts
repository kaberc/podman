import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  SecretCreateQuery,
  SecretCreateReport,
  SecretRemoveQuery,
  SecretInfoReport,
  SecretInspectQuery,
  SecretListQuery,
} from "../types/api.ts";

export class SecretsApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a new secret from the given data string. */
  async create(
    data: string,
    query: SecretCreateQuery,
  ): Promise<SecretCreateReport> {
    const path = `/secrets/create${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path, data, {
      "Content-Type": "application/json",
    });
    if (res.status !== 200 && res.status !== 201) await throwRawError(res, "POST", path);
    return (await res.json()) as SecretCreateReport;
  }

  /** Inspect a secret. Returns `null` if the secret is not found. */
  async inspect(
    nameOrId: string,
    query?: SecretInspectQuery,
  ): Promise<SecretInfoReport | null> {
    const path =
      `/secrets/${encodeURIComponent(nameOrId)}/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as SecretInfoReport;
  }

  /** List secrets, optionally filtered by the given query. */
  async list(query?: SecretListQuery): Promise<SecretInfoReport[]> {
    const path = `/secrets/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as SecretInfoReport[];
  }

  /** Remove a secret. */
  async remove(
    nameOrId: string,
    query?: SecretRemoveQuery,
  ): Promise<void> {
    const path =
      `/secrets/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 204) throw createPodmanError(status, json, "DELETE", path);
  }

  /** Check if a secret exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/secrets/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }
}
