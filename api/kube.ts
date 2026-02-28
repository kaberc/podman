import type { Transport } from "../transport.ts";
import { createPodmanError, throwRawError } from "../types/errors.ts";
import { buildQuery } from "../internal/query.ts";
import type {
  KubeApplyQuery,
  PlayKubeDownQuery,
  PlayKubeQuery,
  PlayKubeReport,
} from "../types/api.ts";

export class KubeApi {
  #t: Transport;
  constructor(transport: Transport) {
    this.#t = transport;
  }

  /** Play a Kubernetes YAML file. Body can be YAML string or tar stream. */
  async play(
    body: ReadableStream<Uint8Array> | string,
    query?: PlayKubeQuery,
  ): Promise<PlayKubeReport> {
    const path = `/play/kube${buildQuery(query)}`;
    const contentType =
      typeof body === "string" ? "application/x-yaml" : "application/x-tar";
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": contentType,
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return (await res.json()) as PlayKubeReport;
  }

  /** Tear down pods/resources created by play kube. */
  async down(query?: PlayKubeDownQuery): Promise<PlayKubeReport> {
    const path = `/play/kube${buildQuery(query)}`;
    const { status, json } = await this.#t.request("DELETE", path);
    if (status !== 200) throw createPodmanError(status, json, "DELETE", path);
    return json as PlayKubeReport;
  }

  /** Apply Kubernetes YAML to the Podman system. */
  async apply(
    body: ReadableStream<Uint8Array> | string,
    query?: KubeApplyQuery,
  ): Promise<string> {
    const path = `/kube/apply${buildQuery(query)}`;
    const contentType =
      typeof body === "string" ? "application/x-yaml" : "application/x-tar";
    const res = await this.#t.requestRaw("POST", path, body, {
      "Content-Type": contentType,
    });
    if (res.status !== 200) await throwRawError(res, "POST", path);
    return await res.json() as string;
  }
}
