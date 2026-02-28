import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  ContainerChange,
  ImageBuildQuery,
  ImageRemoveAllQuery,
  ImageCommitQuery,
  ImageChangesQuery,
  ImageExportQuery,
  ImageHistory,
  ImageImportQuery,
  ImageInspect,
  ImageListQuery,
  ImageLoadReport,
  ImagePruneQuery,
  ImagePruneReport,
  ImagePullQuery,
  ImagePushQuery,
  ImageRemoveQuery,
  ImageRemoveReport,
  ImageScpQuery,
  ImageSearchQuery,
  ImageSearchResult,
  ImageSummary,
  ImageTreeQuery,
  ScpReport,
  ImageTreeReport,
  LibpodImagesPullReport,
  LocalBuildQuery,
  LocalImagesQuery,
} from "../types/api.ts";

export class ImagesApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** List images, optionally filtered by the given query. */
  async list(query?: ImageListQuery): Promise<ImageSummary[]> {
    const path = `/images/json${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ImageSummary[];
  }

  /** Inspect an image. Returns `null` if the image is not found. */
  async inspect(nameOrId: string): Promise<ImageInspect | null> {
    const path = `/images/${encodeURIComponent(nameOrId)}/json`;
    const { status, json } = await this.#t.request("GET", path);
    if (status === 404) return null;
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as ImageInspect;
  }

  /** Pull an image from a registry. */
  async pull(query: ImagePullQuery): Promise<LibpodImagesPullReport> {
    const path = `/images/pull${buildQuery(query)}`;
    const headers: Record<string, string> = {};
    const authHeader = this.#t.getAuthHeader();
    if (authHeader) headers["X-Registry-Auth"] = authHeader;
    const res = await this.#t.requestRaw("POST", path, undefined, headers);
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as LibpodImagesPullReport;
  }

  /** Remove an image. Returns a report of untagged and deleted layers. */
  async remove(
    nameOrId: string,
    query?: ImageRemoveQuery,
  ): Promise<ImageRemoveReport> {
    const path =
      `/images/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ImageRemoveReport;
  }

  /** Add a repository tag to an image. */
  async tag(
    nameOrId: string,
    repo: string,
    tag?: string,
  ): Promise<void> {
    const path =
      `/images/${encodeURIComponent(nameOrId)}/tag${buildQuery({ repo, tag })}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
  }

  /** Remove a repository tag from an image. */
  async untag(
    nameOrId: string,
    repo: string,
    tag?: string,
  ): Promise<void> {
    const path = `/images/${encodeURIComponent(nameOrId)}/untag${
      buildQuery({ repo, tag })
    }`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
  }

  /** Search registries for images matching the given query. */
  async search(query: ImageSearchQuery): Promise<ImageSearchResult[]> {
    const path = `/images/search${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ImageSearchResult[];
  }

  /** Return the history of an image's layers. */
  async history(nameOrId: string): Promise<ImageHistory[]> {
    const path = `/images/${encodeURIComponent(nameOrId)}/history`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ImageHistory[];
  }

  /** Push an image to a registry. */
  async push(
    nameOrId: string,
    query?: ImagePushQuery,
  ): Promise<void> {
    const path =
      `/images/${encodeURIComponent(nameOrId)}/push${buildQuery(query)}`;
    const headers: Record<string, string> = {};
    const authHeader = this.#t.getAuthHeader();
    if (authHeader) headers["X-Registry-Auth"] = authHeader;
    const res = await this.#t.requestRaw("POST", path, undefined, headers);
    if (res.status !== 200) await throwRawError(res, "POST", path);
    await res.body?.cancel();
  }

  /** Import an image from a tar archive stream. Returns the new image ID. */
  async import(
    body: ReadableStream<Uint8Array>,
    query?: ImageImportQuery,
  ): Promise<string> {
    const path = `/images/import${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    const result = await res.json();
    return (result as { Id: string }).Id;
  }

  /** Export an image as a tar archive stream. */
  async export(
    nameOrId: string,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/images/${encodeURIComponent(nameOrId)}/get`;
    return await this.#t.requestStream("GET", path);
  }

  /** Remove unused images. Returns a list of pruned images. */
  async prune(query?: ImagePruneQuery): Promise<ImagePruneReport[]> {
    const path = `/images/prune${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return (json ?? []) as ImagePruneReport[];
  }

  /** Build an image from a build context tar stream. Returns the build output stream. */
  async build(
    body: ReadableStream<Uint8Array>,
    query?: ImageBuildQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/build${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status >= 400) await throwRawError(res, "POST", path);
    if (!res.body) {
      throw new Error("No response body for build");
    }
    return res.body;
  }

  /** Check if an image exists. Returns `true` on 204, `false` otherwise. */
  async exists(nameOrId: string): Promise<boolean> {
    const path = `/images/${encodeURIComponent(nameOrId)}/exists`;
    const { status } = await this.#t.request("GET", path);
    return status === 204;
  }

  /** Create a new image from a container's changes. */
  async commit(query: ImageCommitQuery): Promise<void> {
    const path = `/commit${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 201) throw createPodmanError(status, json, "POST", path);
  }

  /** Load images from a tar archive. */
  async load(body: ReadableStream<Uint8Array>): Promise<ImageLoadReport> {
    const path = "/images/load";
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": "application/x-tar",
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as ImageLoadReport;
  }

  /** Get a tree representation of an image's layers. */
  async tree(
    nameOrId: string,
    query?: ImageTreeQuery,
  ): Promise<ImageTreeReport> {
    const path = `/images/${encodeURIComponent(nameOrId)}/tree${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as ImageTreeReport;
  }

  /** List filesystem changes in an image. */
  async changes(
    nameOrId: string,
    query?: ImageChangesQuery,
  ): Promise<ContainerChange[]> {
    const path = `/images/${encodeURIComponent(nameOrId)}/changes${buildQuery(query)}`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return (json ?? []) as ContainerChange[];
  }

  /** Resolve a short image name to a full reference. */
  async resolve(nameOrId: string): Promise<string> {
    const path = `/images/${encodeURIComponent(nameOrId)}/resolve`;
    const { status, json } = await this.#t.request("GET", path);
    if (status !== 200) throw createPodmanError(status, json, "GET", path);
    return json as string;
  }

  /** Export multiple images as a single tar archive stream. */
  async exportMultiple(
    query?: ImageExportQuery,
  ): Promise<ReadableStream<Uint8Array>> {
    const path = `/images/export${buildQuery(query)}`;
    return await this.#t.requestStream("GET", path);
  }

  /** Remove one or more images. */
  async removeAll(query?: ImageRemoveAllQuery): Promise<ImageRemoveReport> {
    const path = `/images${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as ImageRemoveReport;
  }

  /** Copy an image between hosts via SCP. */
  async scp(
    nameOrId: string,
    query?: ImageScpQuery,
  ): Promise<ScpReport> {
    const path = `/images/scp/${encodeURIComponent(nameOrId)}${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as ScpReport;
  }

  /** Load an image from a file path on the Podman server's filesystem. */
  async loadLocal(query: LocalImagesQuery): Promise<ImageLoadReport> {
    const path = `/local/images/load${buildQuery(query)}`;
    const { status, json } = await this.#t.request("POST", path);
    if (status !== 200) throw createPodmanError(status, json, "POST", path);
    return json as ImageLoadReport;
  }

  /** Build an image from a local directory on the Podman server's filesystem. Returns the build output stream. */
  async buildLocal(query: LocalBuildQuery): Promise<ReadableStream<Uint8Array>> {
    const path = `/local/build${buildQuery(query)}`;
    const res = await this.#t.requestRaw("POST", path);
    if (res.status >= 400) await throwRawError(res, "POST", path);
    if (!res.body) {
      throw new Error("No response body for build");
    }
    return res.body;
  }
}
