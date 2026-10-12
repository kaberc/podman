import type { Transport } from "../transport.ts";
import {
  createPodmanError,
  PodmanError,
  throwRawError,
} from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  Network,
  NetworkConnectOptions,
  NetworkCreateOptions,
  NetworkCreateQuery,
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
  async create(
    opts: NetworkCreateOptions,
    query?: NetworkCreateQuery,
  ): Promise<Network> {
    const path = `/networks/create${buildQuery(query)}`;
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
  async remove(nameOrId: string): Promise<{ alreadyRemoved: boolean }> {
    const path = `/networks/${encodeURIComponent(nameOrId)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status === 404) return { alreadyRemoved: true };
    if (status === 204) return { alreadyRemoved: false };
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    const failure = (message: string) =>
      new PodmanError({ status, method: "DELETE", path, message });
    if (!Array.isArray(json)) throw failure("Invalid network remove report");
    const reports: readonly unknown[] = json;
    for (const report of reports) {
      if (typeof report !== "object" || report === null || !("Err" in report)) {
        throw failure("Invalid network remove report");
      }
      const { Err } = report;
      if (Err !== null) {
        throw failure(
          typeof Err === "string" && Err ? Err : "Network removal failed",
        );
      }
    }
    return { alreadyRemoved: false };
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
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /**
   * Connect a container to a network. Podman has no already-connected status:
   * a repeated connect fails with a {@link PodmanError}.
   */
  async connect(
    nameOrId: string,
    opts: NetworkConnectOptions,
  ): Promise<{ alreadyConnected: false }> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/connect`;
    const res = await this.#t.requestRaw("POST", path, JSON.stringify(opts), {
      "Content-Type": "application/json",
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    await res.body?.cancel();
    return { alreadyConnected: false };
  }

  /**
   * Disconnect a container from a network. Podman has no not-connected status:
   * a repeated disconnect fails with a {@link PodmanError}.
   */
  async disconnect(
    nameOrId: string,
    opts: NetworkDisconnectOptions,
  ): Promise<{ alreadyDisconnected: false }> {
    const path = `/networks/${encodeURIComponent(nameOrId)}/disconnect`;
    const res = await this.#t.requestRaw("POST", path, JSON.stringify(opts), {
      "Content-Type": "application/json",
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    await res.body?.cancel();
    return { alreadyDisconnected: false };
  }

  /** Remove unused networks. Returns a list of pruned networks. */
  async prune(query?: NetworkPruneQuery): Promise<NetworkPruneReport[]> {
    const path = `/networks/prune${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return (json ?? []) as NetworkPruneReport[];
  }
}
