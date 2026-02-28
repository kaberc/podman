import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  ContainerArchiveQuery,
  ContainerArchivePutQuery,
  ContainerAttachQuery,
  ContainerChange,
  ContainerChangesQuery,
  ContainerCheckpointQuery,
  ContainerCreateResponse,
  ContainerStatsAllQuery,
  ContainerKillQuery,
  ContainerListQuery,
  ContainerLogsQuery,
  ContainerPruneQuery,
  ContainerRemoveQuery,
  ContainerResizeQuery,
  ContainerRestartQuery,
  ContainerRestoreQuery,
  ContainersPruneReport,
  ContainerStatsQuery,
  ContainerStopQuery,
  ContainerTopQuery,
  ContainerTopResponse,
  ContainerUpdateQuery,
  ContainerWaitQuery,
  HealthCheckResults,
  InspectContainerData,
  ListContainer,
  SpecGenerator,
  UpdateEntities,
} from "../types/api.ts";

export class ContainersApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Create a new container from the given spec. */
  async create(spec: SpecGenerator): Promise<ContainerCreateResponse> {
    const path = "/containers/create";
    const { status, json } = await this.#t.request("POST", path, spec);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
    return json as ContainerCreateResponse;
  }

  /** Inspect a container. Returns `null` if the container is not found. */
  async inspect(
    nameOrId: string,
  ): Promise<InspectContainerData | null> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as InspectContainerData;
  }

  /** List containers, optionally filtered by the given query. */
  async list(query?: ContainerListQuery): Promise<ListContainer[]> {
    const path = `/containers/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ListContainer[];
  }

  /** Start a container. */
  async start(nameOrId: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/start`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204 && status !== 304) throw createPodmanError(status, json, "POST", path);
  }

  /** Stop a container with an optional timeout. */
  async stop(
    nameOrId: string,
    query?: ContainerStopQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/stop${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204 && status !== 304) throw createPodmanError(status, json, "POST", path);
  }

  /** Restart a container with an optional timeout. */
  async restart(
    nameOrId: string,
    query?: ContainerRestartQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/restart${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** Send a signal to a container (default SIGTERM). */
  async kill(
    nameOrId: string,
    query?: ContainerKillQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/kill${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** Pause all processes in a container. */
  async pause(nameOrId: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/pause`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** Unpause all processes in a container. */
  async unpause(nameOrId: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/unpause`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** Remove a container. Use query options to force-remove or remove volumes. */
  async remove(
    nameOrId: string,
    query?: ContainerRemoveQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200 && status !== 204) {
      throw createPodmanError(status, json, "DELETE", path);
    }
  }

  /** Stream container logs as raw bytes. */
  async logs(
    nameOrId: string,
    query?: ContainerLogsQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/logs${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** List processes running inside a container. */
  async top(
    nameOrId: string,
    query?: ContainerTopQuery,
  ): Promise<ContainerTopResponse> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/top${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as ContainerTopResponse;
  }

  /** Wait for a container to meet a given condition. Returns the exit code. */
  async wait(
    nameOrId: string,
    query?: ContainerWaitQuery,
  ): Promise<number> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/wait${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as number;
  }

  /** Rename a container. */
  async rename(nameOrId: string, newName: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/rename${
      buildQuery({ name: newName })
    }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** Resize a container's TTY dimensions. */
  async resize(
    nameOrId: string,
    query: ContainerResizeQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/resize${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
  }

  /** Export a container's filesystem as a tar stream. */
  async export(nameOrId: string): Promise<ReadableStream<Uint8Array>> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/export`;
    return await this.#t.requestStream("GET", path);
  }

  /** Checkpoint a running container using CRIU. */
  async checkpoint(
    nameOrId: string,
    query?: ContainerCheckpointQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/checkpoint${
        buildQuery(query)
      }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
  }

  /** Restore a previously checkpointed container. */
  async restore(
    nameOrId: string,
    query?: ContainerRestoreQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/restore${
        buildQuery(query)
      }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
  }

  /** Check if a container exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Remove stopped containers. Returns a list of pruned containers. */
  async prune(query?: ContainerPruneQuery): Promise<ContainersPruneReport[]> {
    const path = `/containers/prune${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return (json ?? []) as ContainersPruneReport[];
  }

  /** Stream resource usage statistics for a container. */
  async stats(
    nameOrId: string,
    query?: ContainerStatsQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/stats${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** Attach to a container and stream its output. */
  async attach(
    nameOrId: string,
    query?: ContainerAttachQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/attach${buildQuery(query)}`;
    return await this.#t.requestStream("POST", path);
  }

  /** Download a file or directory from a container as a tar archive stream. */
  async getArchive(
    nameOrId: string,
    query: ContainerArchiveQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/archive${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** Upload a tar archive stream into a container at the specified path. */
  async putArchive(
    nameOrId: string,
    body: ReadableStream<Uint8Array>,
    query: ContainerArchivePutQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/archive${buildQuery(query)}`;
    const res = await this.#t.requestRaw("PUT", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status !== 200) await throwRawError(res, "PUT", path);
  }

  /** Run a container health check and return the results. */
  async healthcheck(nameOrId: string): Promise<HealthCheckResults> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/healthcheck`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as HealthCheckResults;
  }

  /** Initialize a container, preparing it to be started. */
  async init(nameOrId: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/init`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204 && status !== 304) throw createPodmanError(status, json, "POST", path);
  }

  /** Update a container's resource limits. */
  async update(
    nameOrId: string,
    resources: UpdateEntities,
    query?: ContainerUpdateQuery,
  ): Promise<void> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/update${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path, resources);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
  }

  /** List filesystem changes made inside a container. */
  async changes(
    nameOrId: string,
    query?: ContainerChangesQuery,
  ): Promise<ContainerChange[]> {
    const path =
      `/containers/${encodeURIComponent(nameOrId)}/changes${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ContainerChange[];
  }

  /** Mount a container's filesystem. Returns the mount path. */
  async mount(nameOrId: string): Promise<string> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/mount`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as string;
  }

  /** Unmount a container's filesystem. */
  async unmount(nameOrId: string): Promise<void> {
    const path = `/containers/${encodeURIComponent(nameOrId)}/unmount`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 204) throw createPodmanError(status, json, "POST", path);
  }

  /** List all mounted containers and their mount points. */
  async showMounted(): Promise<Record<string, string>> {
    const path = "/containers/showmounted";
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as Record<string, string>;
  }

  /** Stream resource usage statistics for all containers. */
  async statsAll(
    query?: ContainerStatsAllQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/containers/stats${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }
}
