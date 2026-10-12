import type { IDResponse } from "../types/api.ts";
import { PodmanError } from "../types/errors.ts";
import { readJsonLines } from "./json-lines.ts";
import { PodmanStreamError } from "./multiplexed-output.ts";

/**
 * Reduce a manifest push response to its digest. Quiet pushes answer with one
 * report and nonquiet pushes stream progress before it; both finish with a
 * report that has a non-empty `Id`, or an in-band `error` after HTTP 200.
 */
export async function readManifestPush(
  stream: ReadableStream<Uint8Array>,
  path: string,
): Promise<IDResponse> {
  const failure = (message: string) =>
    new PodmanError({ status: 200, method: "POST", path, message });
  let digest = "";
  try {
    for await (const value of readJsonLines(stream)) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw failure("Invalid manifest push report");
      }
      if ("error" in value && value.error) {
        throw failure(String(value.error));
      }
      if ("Id" in value && typeof value.Id === "string" && value.Id) {
        digest = value.Id;
      }
    }
  } catch (error) {
    if (error instanceof PodmanStreamError) throw failure(error.message);
    throw error;
  }
  if (!digest) throw failure("Missing terminal manifest push report");
  return { Id: digest };
}
