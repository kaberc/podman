import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  GenerateKubeQuery,
  GenerateSystemdQuery,
} from "../types/api.ts";

export class GenerateApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Generate systemd unit files for a container or pod. Returns a map of unit name to content. */
  async systemd(
    nameOrId: string,
    query?: GenerateSystemdQuery,
  ): Promise<Record<string, string>> {
    const path =
      `/generate/${encodeURIComponent(nameOrId)}/systemd${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as Record<string, string>;
  }

  /** Generate a Kubernetes YAML manifest for a container or pod. */
  async kube(query: GenerateKubeQuery): Promise<string> {
    const path = `/generate/kube${buildQuery(query)}`;
    const res = await this.#t.requestRaw("GET", path);
    if (res.status >= 400) await throwRawError(res, "GET", path);
    return await res.text();
  }
}
