/**
 * Base error thrown by the Podman client on API failures. Includes HTTP status, method, and path.
 * `createPodmanError` dispatches to a typed subclass for common statuses (304/401/403/404/409/5xx);
 * other statuses (e.g. 400, 418) are returned as instances of this base class.
 * Note: `inspect()` methods return `null` on 404 instead of throwing.
 */
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

/** 304 Not Modified — operation was a no-op because the resource is already in the desired state. */
export class PodmanNotModifiedError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanNotModifiedError";
  }
}

/** 401 Unauthorized — missing or invalid credentials. */
export class PodmanAuthError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanAuthError";
  }
}

/** 403 Forbidden — credentials valid but operation not allowed. */
export class PodmanForbiddenError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanForbiddenError";
  }
}

/** 404 Not Found — target resource does not exist. */
export class PodmanNotFoundError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanNotFoundError";
  }
}

/** 409 Conflict — resource state prevents the operation. */
export class PodmanConflictError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanConflictError";
  }
}

/** 5xx — server-side failure (libpod error, storage error, etc.). */
export class PodmanServerError extends PodmanError {
  constructor(
    opts: { status: number; message: string; method: string; path: string },
  ) {
    super(opts);
    this.name = "PodmanServerError";
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

/**
 * Create a PodmanError from a status code and raw JSON body.
 * Dispatches to a typed subclass based on `status`:
 * - 304 → {@link PodmanNotModifiedError}
 * - 401 → {@link PodmanAuthError}
 * - 403 → {@link PodmanForbiddenError}
 * - 404 → {@link PodmanNotFoundError}
 * - 409 → {@link PodmanConflictError}
 * - 5xx → {@link PodmanServerError}
 * - other → {@link PodmanError} (base)
 */
export function createPodmanError(
  status: number,
  json: unknown,
  method: string,
  path: string,
): PodmanError {
  const opts = { status, message: extractMessage(json), method, path };
  if (status === 304) return new PodmanNotModifiedError(opts);
  if (status === 401) return new PodmanAuthError(opts);
  if (status === 403) return new PodmanForbiddenError(opts);
  if (status === 404) return new PodmanNotFoundError(opts);
  if (status === 409) return new PodmanConflictError(opts);
  if (status >= 500 && status < 600) return new PodmanServerError(opts);
  return new PodmanError(opts);
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
