import type { Transport } from "../transport.ts";
import { createPodmanError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  Network,
  NetworkConnectOptions,
  NetworkCreateOptions,
  NetworkDisconnectOptions,
  NetworkListQuery,
  NetworkPruneQuery,
  NetworkPruneReport,
  NetworkUpdateOptions,
} from "../types/api.ts";


export class NetworksApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a new network. */
  async create(opts: NetworkCreateOptions): Promise<Network> {
    const path = "/networks/create";
    const { status, json } = await this.#t.request("POST", path, opts);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as Network;
  }

  /** Inspect a network. Returns `null` if the network is not found. */
  async inspect(nameOrId: string): Promise<Network | null> {
    const path = `/networks/${encodeURIComponent(nameOrId)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as Network;
  }

  /** List networks, optionally filtered by the given query. */
  async list(query?: NetworkListQuery): Promise<Network[]> {
    const path = `/networks/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as Network[];
  }

  /** Remove a network. */
  async remove(nameOrId: string): Promise<void> {
    const path = `/networks/${encodeURIComponent(nameOrId)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200 && status !== 204) {
      throw createPodmanError(status, json, "DELETE", path);
    }
  }


  /** Check if a network exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Update an existing network (e.g. add/remove DNS servers). Requires Podman 5.0+. */
  async update(nameOrId: string, opts: NetworkUpdateOptions): Promise<void> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/update`;
    const { status, json } = await this.#t.request("POST", path, opts);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
  }
  /** Connect a container to a network. */
  async connect(nameOrId: string, opts: NetworkConnectOptions): Promise<void> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/connect`;
    const res = await this.#t.requestRaw("POST", path, JSON.stringify(opts), {
      "Content-Type": "application/json",
    });
    if (res.status !== 200) {
      const text = await res.text();
      let json: unknown = null;
      try { json = JSON.parse(text); } catch { /* plain text */ }
      throw createPodmanError(res.status, json, "POST", path);
    }
  }

  /** Disconnect a container from a network. */
  async disconnect(
    nameOrId: string,
    opts: NetworkDisconnectOptions,
  ): Promise<void> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/disconnect`;
    const res = await this.#t.requestRaw("POST", path, JSON.stringify(opts), {
      "Content-Type": "application/json",
    });
    if (res.status !== 200) {
      const text = await res.text();
      let json: unknown = null;
      try { json = JSON.parse(text); } catch { /* plain text */ }
      throw createPodmanError(res.status, json, "POST", path);
    }
  }

  /** Remove unused networks. Returns a list of pruned networks. */
  async prune(query?: NetworkPruneQuery): Promise<NetworkPruneReport[]> {
    const path = `/networks/prune${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return (json ?? []) as NetworkPruneReport[];
  }
}
