#!/usr/bin/env -S deno run --allow-net --allow-write --allow-read --allow-run

import { join } from "jsr:@std/path@1";
import { parse as parseYaml } from "jsr:@std/yaml@1";

const PODMAN_SPEC_URL =
  "https://storage.googleapis.com/libpod-master-releases/swagger-latest.yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const TYPES_DIR = join(ROOT, "types");
const SWAGGER_PATH = join(ROOT, ".podman-swagger.yaml");
const OPENAPI3_PATH = join(ROOT, ".podman-openapi3.yaml");
const MODELS_DIR = join(TYPES_DIR, "models");
const GENERATED_INDEX_PATH = join(TYPES_DIR, "index.ts");
const MODEL_INDEX_PATH = join(MODELS_DIR, "index.ts");
const QUERY_OUTPUT_PATH = join(TYPES_DIR, "queries.ts");

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
    args: ["-y", "swagger2openapi", SWAGGER_PATH, "-o", OPENAPI3_PATH],
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
      "openapi-typescript-codegen",
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

type OpenApiObject = Record<string, unknown>;

function refName(ref: string): string {
  return decodeURIComponent(ref.split("/").at(-1) ?? "unknown");
}

function quotePropertyName(name: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
}

function schemaType(schema: OpenApiObject | undefined): string {
  if (!schema) return "unknown";

  const ref = schema.$ref;
  if (typeof ref === "string") return `models.${refName(ref)}`;

  for (const unionKey of ["oneOf", "anyOf"] as const) {
    const variants = schema[unionKey];
    if (Array.isArray(variants)) {
      return variants.map((variant) => schemaType(variant as OpenApiObject))
        .join(" | ");
    }
  }

  const allOf = schema.allOf;
  if (Array.isArray(allOf)) {
    return allOf.map((variant) => schemaType(variant as OpenApiObject)).join(
      " & ",
    );
  }

  const enumValues = schema.enum;
  if (Array.isArray(enumValues) && enumValues.length > 0) {
    return enumValues.map((value) => JSON.stringify(value)).join(" | ");
  }

  const type = schema.type;
  if (type === "array") {
    return `Array<${schemaType(schema.items as OpenApiObject | undefined)}>`;
  }
  if (type === "integer" || type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "string") return "string";
  if (type === "object") return "Record<string, unknown>";

  return "unknown";
}

function resolveParameter(
  parameter: OpenApiObject,
  components: OpenApiObject,
): OpenApiObject {
  const ref = parameter.$ref;
  if (typeof ref !== "string") return parameter;

  const name = refName(ref);
  const parameters = components.parameters as
    | Record<string, OpenApiObject>
    | undefined;
  const resolved = parameters?.[name];
  if (!resolved) throw new Error(`Unable to resolve parameter ${ref}`);
  return resolved;
}

function queryTypeBody(
  parameters: OpenApiObject[],
  components: OpenApiObject,
): string | undefined {
  const queryParams = parameters
    .map((parameter) => resolveParameter(parameter, components))
    .filter((parameter) => parameter.in === "query");

  if (queryParams.length === 0) return undefined;

  const fields = queryParams.map((parameter) => {
    const name = String(parameter.name);
    const optional = parameter.required === true ? "" : "?";
    return `  ${quotePropertyName(name)}${optional}: ${
      schemaType(parameter.schema as OpenApiObject | undefined)
    };`;
  });

  return `{
${fields.join("\n")}
}`;
}

async function generateQueryTypes(): Promise<void> {
  console.log("Generating operation query param types...");
  const specText = await Deno.readTextFile(OPENAPI3_PATH);
  const spec = parseYaml(specText) as OpenApiObject;
  const components = (spec.components ?? {}) as OpenApiObject;
  const paths = (spec.paths ?? {}) as Record<string, OpenApiObject>;
  const methods = ["get", "put", "post", "delete", "patch", "options", "head"];
  const lines: string[] = [];

  for (const pathItem of Object.values(paths)) {
    const pathParams = (pathItem.parameters ?? []) as OpenApiObject[];

    for (const method of methods) {
      const op = pathItem[method] as OpenApiObject | undefined;
      if (!op?.operationId) continue;
      const operationId = op.operationId as string;
      if (!operationId.endsWith("Libpod")) continue;

      const opParams = (op.parameters ?? []) as OpenApiObject[];
      const body = queryTypeBody([...pathParams, ...opParams], components);
      if (!body) continue;

      lines.push(`export type ${queryTypeName(operationId)} = ${body};`);
    }
  }

  lines.sort();

  const queryTypes = lines.join("\n\n") + "\n";
  const imports = queryTypes.includes("models.")
    ? 'import type * as models from "./models/index.ts";\n\n'
    : "";

  await Deno.writeTextFile(
    QUERY_OUTPUT_PATH,
    "// Auto-generated by scripts/generate-types.ts. Do not edit.\n\n" +
      imports +
      "// ─── Auto-generated operation query param types ───\n\n" +
      queryTypes,
  );
  console.log(
    `Wrote ${lines.length} query param types to ${QUERY_OUTPUT_PATH}`,
  );
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
    await generateQueryTypes();
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
