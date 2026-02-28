#!/usr/bin/env -S deno run --allow-net --allow-write --allow-read --allow-run

import { join } from "jsr:@std/path@1";
import { parse as parseYaml } from "jsr:@std/yaml@1";

const PODMAN_SPEC_URL =
  "https://storage.googleapis.com/libpod-master-releases/swagger-latest.yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const SWAGGER_PATH = join(ROOT, ".podman-swagger.yaml");
const OPENAPI3_PATH = join(ROOT, ".podman-openapi3.yaml");
const OUTPUT_PATH = join(ROOT, "types", "openapi.ts");

const QUERY_TYPE_RENAMES: Record<string, string> = {
  ArtifactDeleteAllLibpod: "ArtifactRemoveAll",
  ContainerDeleteLibpod: "ContainerRemove",
  ContainersStatsAllLibpod: "ContainerStatsAll",
  ImageDeleteAllLibpod: "ImageRemoveAll",
  ImageDeleteLibpod: "ImageRemove",
  ManifestDeleteLibpod: "ManifestRemove",
  NetworkDeleteLibpod: "NetworkRemove",
  PodDeleteLibpod: "PodRemove",
  PodStatsAllLibpod: "PodStats",
  PutContainerArchiveLibpod: "ContainerArchivePut",
  QuadletDeleteAllLibpod: "QuadletRemoveAll",
  QuadletDeleteLibpod: "QuadletRemove",
  SecretDeleteLibpod: "SecretRemove",
  VolumeDeleteLibpod: "VolumeRemove",
};

function queryTypeName(operationId: string): string {
  const override = QUERY_TYPE_RENAMES[operationId];
  if (override) return `${override}Query`;
  return `${operationId.replace(/Libpod$/, "")}Query`;
}

async function downloadSpec(): Promise<void> {
  console.log(`Downloading ${PODMAN_SPEC_URL}...`);
  const res = await fetch(PODMAN_SPEC_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch spec: ${res.status} ${res.statusText}`);
  }
  await Deno.writeTextFile(SWAGGER_PATH, await res.text());
  console.log(`Saved to ${SWAGGER_PATH}`);
}

async function convertToOpenApi3(): Promise<void> {
  console.log("Converting Swagger 2.0 → OpenAPI 3.0...");
  const cmd = new Deno.Command("npx", {
    args: ["swagger2openapi", SWAGGER_PATH, "-o", OPENAPI3_PATH],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`swagger2openapi failed with exit code ${code}`);
  }
  console.log(`Converted to ${OPENAPI3_PATH}`);
}

async function generateTypes(): Promise<void> {
  console.log("Generating TypeScript types...");
  const cmd = new Deno.Command("npx", {
    args: [
      "openapi-typescript", OPENAPI3_PATH,
      "-o", OUTPUT_PATH,
      "--export-type",
      "--root-types",
      "--root-types-no-schema-prefix",
      "--root-types-keep-casing",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`openapi-typescript failed with exit code ${code}`);
  }
  console.log(`Generated ${OUTPUT_PATH}`);
}

async function generateQueryTypes(): Promise<void> {
  console.log("Generating operation query param types...");
  const specText = await Deno.readTextFile(OPENAPI3_PATH);
  const spec = parseYaml(specText) as Record<string, unknown>;
  const paths = (spec.paths ?? {}) as Record<string, Record<string, unknown>>;
  const methods = ["get", "put", "post", "delete", "patch", "options", "head"];

  const lines: string[] = [];

  for (const pathItem of Object.values(paths)) {
    const pathParams = (pathItem.parameters ?? []) as Array<Record<string, unknown>>;

    for (const method of methods) {
      const op = pathItem[method] as Record<string, unknown> | undefined;
      if (!op?.operationId) continue;
      const operationId = op.operationId as string;
      if (!operationId.endsWith("Libpod")) continue;

      const opParams = (op.parameters ?? []) as Array<Record<string, unknown>>;
      const allParams = [...pathParams, ...opParams];
      if (!allParams.some((p) => p.in === "query")) continue;

      const name = queryTypeName(operationId);
      lines.push(
        `export type ${name} = NonNullable<operations["${operationId}"]["parameters"]["query"]>;`,
      );
    }
  }

  lines.sort();

  const block = "\n// ─── Auto-generated operation query param types ───\n\n" +
    lines.join("\n") + "\n";

  await Deno.writeTextFile(OUTPUT_PATH, block, { append: true });
  console.log(`Appended ${lines.length} query param types to ${OUTPUT_PATH}`);
}

async function cleanup(): Promise<void> {
  for (const path of [SWAGGER_PATH, OPENAPI3_PATH]) {
    try {
      await Deno.remove(path);
    } catch {
      // ignore cleanup failures
    }
  }
}

async function main(): Promise<void> {
  try {
    await downloadSpec();
    await convertToOpenApi3();
    await generateTypes();
    await generateQueryTypes();
    console.log("\nDone. All types written to types/openapi.ts");
    console.log("Friendly aliases in types/api.ts for renamed schemas and overrides only.");
  } finally {
    await cleanup();
  }
}

main();
