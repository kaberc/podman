#!/usr/bin/env -S deno run --allow-net --allow-write --allow-read --allow-run

import { join } from "@std/path";
import { generateQueryTypes } from "./generate-queries.ts";

// Pinned to the official v6.1.3 docs spec. The GCS `swagger-latest.yaml` is broken
// upstream (38 schemas lose `properties:`, 57 schemas are missing). Update the URL
// and digest together.
const PODMAN_SPEC_URL = "https://docs.podman.io/en/v6.1.3/_static/swagger.yaml";
const PODMAN_SPEC_SHA256 =
  "3c09e587c474484c3c1364df4318b0fd934f32ed78a79465e7d8f0ef8377fa8a";
const SWAGGER2OPENAPI = "swagger2openapi@7.0.8";
const OPENAPI_TYPESCRIPT_CODEGEN = "openapi-typescript-codegen@0.31.0";

const ROOT = new URL("..", import.meta.url).pathname;
const TYPES_DIR = join(ROOT, "types");
const SWAGGER_PATH = join(ROOT, ".podman-swagger.yaml");
const OPENAPI3_PATH = join(ROOT, ".podman-openapi3.yaml");
const MODELS_DIR = join(TYPES_DIR, "models");
const GENERATED_INDEX_PATH = join(TYPES_DIR, "index.ts");
const MODEL_INDEX_PATH = join(MODELS_DIR, "index.ts");
const QUERY_OUTPUT_PATH = join(TYPES_DIR, "queries.ts");

function toHex(buffer: ArrayBuffer): string {
  return Array.from(
    new Uint8Array(buffer),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function downloadSpec(): Promise<void> {
  console.log(`Downloading ${PODMAN_SPEC_URL}...`);
  const res = await fetch(PODMAN_SPEC_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch spec: ${res.status} ${res.statusText}`);
  }
  const body = new Uint8Array(await res.arrayBuffer());
  const digest = toHex(await crypto.subtle.digest("SHA-256", body));
  if (digest !== PODMAN_SPEC_SHA256) {
    throw new Error(
      `Spec digest mismatch: expected ${PODMAN_SPEC_SHA256}, got ${digest}`,
    );
  }
  await Deno.writeFile(SWAGGER_PATH, body);
  console.log(`Saved to ${SWAGGER_PATH}`);
}

async function convertToOpenApi3(): Promise<void> {
  console.log("Converting Swagger 2.0 → OpenAPI 3.0...");
  const cmd = new Deno.Command("npx", {
    args: ["-y", SWAGGER2OPENAPI, SWAGGER_PATH, "-o", OPENAPI3_PATH],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`swagger2openapi failed with exit code ${code}`);
  }
  console.log(`Converted to ${OPENAPI3_PATH}`);
}

async function removeOldOpenApiOutput(): Promise<void> {
  try {
    await Deno.remove(MODELS_DIR, { recursive: true });
  } catch {
    // ignore missing output directory
  }

  for await (const entry of Deno.readDir(TYPES_DIR)) {
    if (entry.isFile && entry.name === "index.ts") {
      await Deno.remove(join(TYPES_DIR, entry.name));
    }
  }
}

async function generateModelTypes(): Promise<void> {
  console.log("Generating split OpenAPI model types...");
  await removeOldOpenApiOutput();
  const cmd = new Deno.Command("npx", {
    args: [
      "-y",
      OPENAPI_TYPESCRIPT_CODEGEN,
      "--input",
      OPENAPI3_PATH,
      "--output",
      TYPES_DIR,
      "--exportCore",
      "false",
      "--exportServices",
      "false",
      "--exportModels",
      "true",
      "--exportSchemas",
      "false",
      "--useUnionTypes",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`openapi-typescript-codegen failed with exit code ${code}`);
  }

  await Deno.rename(GENERATED_INDEX_PATH, MODEL_INDEX_PATH);
  await makeGeneratedTypesDenoCompatible(MODELS_DIR);
  await makeModelIndexRelativeToModelsDir();

  console.log(`Generated ${MODELS_DIR}`);
}

async function makeModelIndexRelativeToModelsDir(): Promise<void> {
  const source = await Deno.readTextFile(MODEL_INDEX_PATH);
  const updated = source
    .replaceAll('from "./models/', 'from "./')
    .replaceAll("from './models/", "from './");
  if (updated === source) {
    throw new Error("Generated model index did not contain model import paths");
  }
  await Deno.writeTextFile(
    MODEL_INDEX_PATH,
    updated,
  );
}

async function makeGeneratedTypesDenoCompatible(path: string): Promise<void> {
  const stat = await Deno.stat(path);
  if (stat.isFile) {
    await makeGeneratedFileDenoCompatible(path);
    return;
  }

  for await (const entry of Deno.readDir(path)) {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory) {
      await makeGeneratedTypesDenoCompatible(entryPath);
      continue;
    }
    if (!entry.isFile || !entry.name.endsWith(".ts")) continue;

    await makeGeneratedFileDenoCompatible(entryPath);
  }
}

async function makeGeneratedFileDenoCompatible(path: string): Promise<void> {
  const source = await Deno.readTextFile(path);
  const updated = source
    .replaceAll(
      /(from\s+['"])(\.[^'"]*?)(['"])/g,
      (_match, prefix: string, specifier: string, suffix: string) => {
        if (specifier.endsWith(".ts")) {
          return `${prefix}${specifier}${suffix}`;
        }
        return `${prefix}${specifier}.ts${suffix}`;
      },
    )
    .replaceAll(/\bany\b/g, "unknown");
  if (updated !== source) await Deno.writeTextFile(path, updated);
}

async function formatGeneratedTypes(): Promise<void> {
  console.log("Formatting generated OpenAPI types...");
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["fmt", MODEL_INDEX_PATH, QUERY_OUTPUT_PATH, MODELS_DIR],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  if (code !== 0) {
    throw new Error(`deno fmt failed with exit code ${code}`);
  }
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
    await generateModelTypes();
    await generateQueryTypes(OPENAPI3_PATH, QUERY_OUTPUT_PATH);
    await formatGeneratedTypes();
    console.log(
      "\nDone. Generator-split OpenAPI types written to types/models/.",
    );
    console.log(
      "Friendly aliases in types/api.ts for renamed schemas and overrides only.",
    );
  } finally {
    await cleanup();
  }
}

main();
