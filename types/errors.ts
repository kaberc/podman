/** Error thrown by the Podman client on non-404 API failures. Includes HTTP status, method, and path. */
export class PodmanError extends Error {
  readonly status: number;
  readonly method: string;
  readonly path: string;

  constructor(opts: {
    status: number;
    message: string;
    method: string;
    path: string;
  }) {
    super(opts.message);
    this.name = "PodmanError";
    this.status = opts.status;
    this.method = opts.method;
    this.path = opts.path;
  }
}

export function extractMessage(json: unknown): string {
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.cause === "string") return obj.cause;
  }
  return "Unknown error";
}

/** Create a PodmanError from a status code and raw JSON body. */
export function createPodmanError(
  status: number,
  json: unknown,
  method: string,
  path: string,
): PodmanError {
  return new PodmanError({
    status,
    message: extractMessage(json),
    method,
    path,
  });
}

/**
 * Read a raw Response body and throw a PodmanError.
 * Use when a `requestRaw()` call returned a non-success status.
 */
export async function throwRawError(
  res: Response,
  method: string,
  path: string,
): Promise<never> {
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text.trim() ? JSON.parse(text) : null;
  } catch {
    throw createPodmanError(res.status, { message: text }, method, path);
  }
  throw createPodmanError(res.status, json, method, path);
}
