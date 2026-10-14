import type { ImageBuildQuery } from "../types/api.ts";
import { buildQuery } from "./query.ts";

export function buildImageQuery(query?: ImageBuildQuery): string {
  return buildQuery({
    ...query,
    // Libpod's empty format writes OCI images but cannot match them in cache lookup.
    outputformat: query?.outputformat ??
      "application/vnd.oci.image.manifest.v1+json",
  });
}
