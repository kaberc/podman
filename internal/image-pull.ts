import type { LibpodImagesPullReport } from "../types/api.ts";
import { PodmanError } from "../types/errors.ts";
import { readJsonLines } from "./json-lines.ts";
import { PodmanStreamError } from "./multiplexed-output.ts";

export async function readImagePull(
  stream: ReadableStream<Uint8Array>,
  path: string,
  onProgress?: (report: LibpodImagesPullReport) => void | Promise<void>,
): Promise<LibpodImagesPullReport> {
  const failure = (message: string) =>
    new PodmanError({ status: 200, method: "POST", path, message });
  const parse = (value: unknown): LibpodImagesPullReport => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw failure("Invalid image pull report");
    }
    const report: LibpodImagesPullReport = {};
    for (const [key, raw] of Object.entries(value)) {
      if (key === "error" || key === "id" || key === "stream") {
        const field: unknown = raw;
        if (typeof field !== "string") {
          throw failure("Invalid image pull report");
        }
        report[key] = field;
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
    if (!Object.keys(report).length) throw failure("Invalid image pull report");
    return report;
  };
  let terminal: LibpodImagesPullReport | undefined;
  const consume = async (value: unknown) => {
    if (terminal) {
      throw failure("Unexpected report after image pull completion");
    }
    const report = parse(value);
    if (report.error) throw failure(report.error);
    if (report.id !== undefined || report.images !== undefined) {
      terminal = report;
    } else if (report.stream !== undefined) {
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
  return terminal;
}
