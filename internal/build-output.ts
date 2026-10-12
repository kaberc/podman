import { PodmanError } from "../types/errors.ts";
import { readJsonLines } from "./json-lines.ts";
import { PodmanStreamError } from "./multiplexed-output.ts";

/** One decoded line of the build output; absent fields were not reported. */
export interface BuildReport {
  readonly stream?: string;
  readonly error?: string;
  readonly errorDetail?: { readonly message?: string };
  readonly aux?: { readonly ID?: string };
}

export type BuildReportHandler = (report: BuildReport) => void | Promise<void>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new PodmanStreamError("frame", `Build report ${key} is not a string`);
  }
  return value;
}

function optionalRecord(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    throw new PodmanStreamError(
      "frame",
      `Build report ${key} is not an object`,
    );
  }
  return value;
}

function parseReport(value: unknown): BuildReport {
  if (!isRecord(value)) {
    throw new PodmanStreamError("frame", "Build report is not an object");
  }
  const detail = optionalRecord(value, "errorDetail");
  const aux = optionalRecord(value, "aux");
  return {
    stream: optionalString(value, "stream"),
    error: optionalString(value, "error"),
    errorDetail: detail && { message: optionalString(detail, "message") },
    aux: aux && { ID: optionalString(aux, "ID") },
  };
}

/**
 * Drain an image build NDJSON stream, passing each decoded report to
 * `onReport` (awaited, so a slow consumer applies backpressure; nothing is
 * retained). Resolves once every report is consumed; an empty stream is a
 * success. A report carrying `error` or `errorDetail` is delivered, then
 * rejects with a {@link PodmanError} even though the HTTP status was 200.
 * Malformed or oversized lines reject with {@link PodmanStreamError}.
 */
export async function collectBuildOutput(
  stream: ReadableStream<Uint8Array>,
  onReport?: BuildReportHandler,
): Promise<void> {
  for await (const value of readJsonLines(stream)) {
    const report = parseReport(value);
    await onReport?.(report);
    const failure = report.error ?? report.errorDetail?.message ??
      (report.errorDetail && "Build failed");
    if (failure !== undefined) {
      throw new PodmanError({
        status: 200,
        message: failure,
        method: "POST",
        path: "/build",
      });
    }
  }
}
