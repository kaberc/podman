import type { Transport } from "../transport.ts";
import type { ImagePullQuery, ImagePushQuery } from "../types/api.ts";
import { PodmanError } from "../types/errors.ts";
import { buildQuery } from "./query.ts";
import { type ImagePullReport, readImagePull } from "./image-pull.ts";
import { readJsonLines } from "./json-lines.ts";
import { PodmanStreamError } from "./multiplexed-output.ts";

function registryHeaders(transport: Transport): Record<string, string> {
  const auth = transport.getAuthHeader();
  return auth ? { "X-Registry-Auth": auth } : {};
}

export async function pullImage(
  transport: Transport,
  query: ImagePullQuery,
  onProgress?: (report: ImagePullReport) => void | Promise<void>,
): Promise<ImagePullReport> {
  const path = `/images/pull${buildQuery(query)}`;
  const stream = await transport.requestStream(
    "POST",
    path,
    undefined,
    registryHeaders(transport),
  );
  return await readImagePull(
    stream,
    { path, compatMode: query.compatMode },
    onProgress,
  );
}

export async function pushImage(
  transport: Transport,
  nameOrId: string,
  query?: ImagePushQuery,
): Promise<void> {
  const path = `/images/${encodeURIComponent(nameOrId)}/push${
    buildQuery(query)
  }`;
  const stream = await transport.requestStream(
    "POST",
    path,
    undefined,
    registryHeaders(transport),
  );
  // Quiet pushes complete before HTTP success; their response is not NDJSON.
  if (query?.quiet !== false) {
    const reader = stream.getReader();
    try {
      while (!(await reader.read()).done) { /* drain the quiet response */ }
    } finally {
      reader.releaseLock();
    }
    return;
  }
  const failure = (message: string) =>
    new PodmanError({ status: 200, method: "POST", path, message });
  let completed = false;
  try {
    for await (const value of readJsonLines(stream)) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw failure("Invalid image push report");
      }
      if ("error" in value) {
        if (typeof value.error !== "string") {
          throw failure("Invalid image push report");
        }
        if (value.error) throw failure(value.error);
      }
      if ("manifestdigest" in value) {
        if (typeof value.manifestdigest !== "string") {
          throw failure("Invalid image push report");
        }
        completed = value.manifestdigest.length > 0;
      }
      if ("stream" in value && typeof value.stream !== "string") {
        throw failure("Invalid image push report");
      }
    }
  } catch (error) {
    if (error instanceof PodmanStreamError) throw failure(error.message);
    throw error;
  }
  if (!completed) throw failure("Missing terminal image push report");
}
