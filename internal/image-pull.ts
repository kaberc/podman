import type {
  ArtifactPullProgress,
  LibpodImagesPullReport,
} from "../types/api.ts";
import { PodmanError } from "../types/errors.ts";
import { readJsonLines } from "./json-lines.ts";
import { PodmanStreamError } from "./multiplexed-output.ts";

/** Native pull fields plus Docker-compatible progress fields. */
export interface ImagePullReport extends LibpodImagesPullReport {
  readonly status?: string;
  readonly progress?: string;
  readonly progressDetail?: {
    readonly current?: number;
    readonly total?: number;
  };
  readonly errorDetail?: { readonly message?: string; readonly code?: number };
}

export async function readImagePull(
  stream: ReadableStream<Uint8Array>,
  request: { readonly path: string; readonly compatMode?: boolean },
  onProgress?: (report: ImagePullReport) => void | Promise<void>,
): Promise<ImagePullReport> {
  const failure = (message: string) =>
    new PodmanError({
      status: 200,
      method: "POST",
      path: request.path,
      message,
    });
  const parse = (value: unknown): ImagePullReport => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw failure("Invalid image pull report");
    }
    const report: LibpodImagesPullReport = {};
    const extra: {
      status?: string;
      progress?: string;
      progressDetail?: { current?: number; total?: number };
      errorDetail?: { message?: string; code?: number };
    } = {};
    for (const [key, raw] of Object.entries(value)) {
      if (key === "error" || key === "id" || key === "stream") {
        const field: unknown = raw;
        if (typeof field !== "string") {
          throw failure("Invalid image pull report");
        }
        report[key] = field;
      }
      if (key === "status" || key === "progress") {
        if (typeof raw !== "string") throw failure("Invalid image pull report");
        extra[key] = raw;
      }
      if (key === "progressDetail" || key === "errorDetail") {
        if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
          throw failure("Invalid image pull report");
        }
        const detail: {
          current?: number;
          total?: number;
          message?: string;
          code?: number;
        } = {};
        for (const [field, item] of Object.entries(raw)) {
          if (field === "message") {
            if (typeof item !== "string") {
              throw failure("Invalid image pull report");
            }
            detail.message = item;
          }
          if (field === "current" || field === "total" || field === "code") {
            if (typeof item !== "number" || !Number.isFinite(item)) {
              throw failure("Invalid image pull report");
            }
            detail[field] = item;
          }
        }
        extra[key] = detail;
      }
      if (key === "pullProgress") {
        if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
          throw failure("Invalid image pull progress");
        }
        const progress: ArtifactPullProgress = {};
        for (const [field, item] of Object.entries(raw)) {
          if (field === "status" || field === "progressComponentID") {
            if (typeof item !== "string") {
              throw failure("Invalid image pull progress");
            }
            progress[field] = item;
          }
          if (field === "current" || field === "total") {
            if (
              typeof item !== "number" || !Number.isInteger(item) ||
              (field === "current" && item < 0) ||
              (field === "total" && item < -1)
            ) {
              throw failure("Invalid image pull progress");
            }
            progress[field] = item;
          }
        }
        report.pullProgress = progress;
      }
    }
    if ("images" in value) {
      if (!Array.isArray(value.images)) {
        throw failure("Invalid image pull report");
      }
      const images: string[] = [];
      for (const image of value.images) {
        if (typeof image !== "string") {
          throw failure("Invalid image pull report");
        }
        images.push(image);
      }
      report.images = images;
    }
    if (!Object.keys(report).length && !Object.keys(extra).length) {
      throw failure("Invalid image pull report");
    }
    return { ...report, ...extra };
  };
  let terminal: ImagePullReport | undefined;
  const consume = async (value: unknown) => {
    if (terminal && !request.compatMode) {
      throw failure("Unexpected report after image pull completion");
    }
    const report = parse(value);
    const error = report.error || report.errorDetail?.message ||
      (report.errorDetail && "Image pull failed");
    if (error) throw failure(error);
    if (report.status === "error") throw failure("Image pull failed");
    if (request.compatMode) {
      terminal = report;
      await onProgress?.(report);
      return;
    }
    if (
      report.status === "success" || report.id !== undefined ||
      report.images !== undefined
    ) {
      terminal = report;
    } else if (
      report.stream !== undefined || report.pullProgress !== undefined ||
      report.status === "pulling"
    ) {
      await onProgress?.(report);
    } else {
      throw failure("Missing terminal image pull report");
    }
  };
  try {
    for await (const value of readJsonLines(stream)) await consume(value);
  } catch (error) {
    if (error instanceof PodmanStreamError) throw failure(error.message);
    throw error;
  }
  if (!terminal) throw failure("Missing terminal image pull report");
  if (
    request.compatMode &&
    (terminal.status !== "Download complete" || !terminal.id)
  ) {
    throw failure("Missing terminal image pull report");
  }
  return terminal;
}
