import type { Transport } from "../transport.ts";
import { createPodmanError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  IDResponse,
  InspectPodData,
  ListPodsReport,
  PodKillQuery,
  PodKillReport,
  PodListQuery,
  PodPauseReport,
  PodPruneReport,
  PodRemoveQuery,
  PodRestartReport,
  PodRmReport,
  PodSpecGenerator,
  PodStartReport,
  PodStatsQuery,
  PodStatsReport,
  PodStopQuery,
  PodStopReport,
  PodTopOKBody,
  PodTopQuery,
  PodUnpauseReport,
} from "../types/api.ts";

export class PodsApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a new pod from the given spec. */
  async create(spec: PodSpecGenerator): Promise<IDResponse> {
    const path = "/pods/create";
    const { status, json } = await this.#t.request("POST", path, spec);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
    return json as IDResponse;
  }

  /** Inspect a pod. Returns `null` if the pod is not found. */
  async inspect(nameOrId: string): Promise<InspectPodData | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as InspectPodData;
  }

  /** List pods, optionally filtered by the given query. */
  async list(query?: PodListQuery): Promise<ListPodsReport[]> {
    const path = `/pods/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ListPodsReport[];
  }

  /** Remove a pod and optionally its containers. Returns `null` if the pod was already absent (HTTP 404). */
  async remove(
    nameOrId: string,
    query?: PodRemoveQuery,
  ): Promise<PodRmReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as PodRmReport;
  }

  /** Start all containers in a pod. Returns `null` if already running (HTTP 304). */
  async start(nameOrId: string): Promise<PodStartReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/start`;
    const { status, json } = await this.#t.request("POST", path);
    if (status === 304) return null;
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodStartReport;
  }

  /** Stop all containers in a pod with an optional timeout. Returns `null` if already stopped (HTTP 304). */
  async stop(
    nameOrId: string,
    query?: PodStopQuery,
  ): Promise<PodStopReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/stop${
      buildQuery(query)
    }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status === 304) return null;
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodStopReport;
  }

  /** Restart all containers in a pod. */
  async restart(nameOrId: string): Promise<PodRestartReport> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/restart`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodRestartReport;
  }

  /** Send a signal to all containers in a pod. Returns `null` if no containers were running (HTTP 409). */
  async kill(
    nameOrId: string,
    query?: PodKillQuery,
  ): Promise<PodKillReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/kill${
      buildQuery(query)
    }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status === 409) return null;
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodKillReport;
  }

  /** Pause all containers in a pod. Returns `null` if the pod was already paused (HTTP 409). */
  async pause(nameOrId: string): Promise<PodPauseReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/pause`;
    const { status, json } = await this.#t.request("POST", path);
    if (status === 409) return null;
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodPauseReport;
  }

  /** Unpause all containers in a pod. Returns `null` if the pod was already unpaused (HTTP 409). */
  async unpause(nameOrId: string): Promise<PodUnpauseReport | null> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/unpause`;
    const { status, json } = await this.#t.request("POST", path);
    if (status === 409) return null;
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodUnpauseReport;
  }

  /** List processes running in the pod's containers. */
  async top(
    nameOrId: string,
    query?: PodTopQuery,
  ): Promise<PodTopOKBody> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/top${
      buildQuery(query)
    }`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as PodTopOKBody;
  }

  /** Check if a pod exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/pods/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Get resource usage statistics for the pod's containers. */
  async stats(query?: PodStatsQuery): Promise<PodStatsReport[]> {
    const path = `/pods/stats${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as PodStatsReport[];
  }

  /** Remove all stopped pods. */
  async prune(): Promise<PodPruneReport> {
    const path = "/pods/prune";
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as PodPruneReport;
  }
}
