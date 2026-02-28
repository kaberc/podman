// Friendly aliases for awkwardly-named schemas, custom types not in the OpenAPI spec,
// and schema overrides. Query param types are auto-generated in openapi.ts.
//
// Run `deno task generate-types` to regenerate types/openapi.ts from Podman's swagger spec.


// Re-export all auto-generated schema types so importers only need this file.
export type * from "./openapi.ts";

import type { components, Mount } from "./openapi.ts";

// ─── Schema renames (spec name → friendly name) ───

export type ContainerTopResponse = components["schemas"]["ContainerTopOKBody"];
export type ContainersPruneReport = components["schemas"]["ContainersPruneReportLibpod"];
export type ImageSummary = components["schemas"]["LibpodImageSummary"];
export type ImageRemoveReport = components["schemas"]["LibpodImagesRemoveReport"];
export type ImageHistory = components["schemas"]["HistoryResponse"];
export type ImagePruneReport = components["schemas"]["PruneReport"];
export type NetworkCreateOptions = components["schemas"]["networkCreateLibpod"];
export type NetworkDisconnectOptions = components["schemas"]["DisconnectOptions"];
export type VolumePruneReport = components["schemas"]["PruneReport"];

// ─── Schema overrides ───

// Podman's swagger spec incorrectly types SpecGenerator.mounts as Docker Mount[].
// The libpod API actually accepts OCI spec mounts with {destination, type, source, options}.
// We override the mounts field to accept both formats.
export type OciMount = {
  destination: string;
  type?: string;
  source?: string;
  options?: string[];
};

type _SpecGenerator = components["schemas"]["SpecGenerator"];
export type SpecGenerator = Omit<_SpecGenerator, "mounts"> & {
  mounts?: (Mount | OciMount)[];
};

// ─── Response-derived types ───

export type ImageSearchResult = NonNullable<
  components["responses"]["registrySearchResponse"]["content"][
    "application/json"
  ]
>;

// ─── Custom types (not in OpenAPI spec) ───

/** Options for creating an exec session inside a container. */
export type ExecCreateConfig = {
  /** Attach to stderr of the exec command. */
  AttachStderr?: boolean;
  /** Attach to stdin of the exec command. */
  AttachStdin?: boolean;
  /** Attach to stdout of the exec command. */
  AttachStdout?: boolean;
  /** Command to run, as a string or array of strings. */
  Cmd?: string[];
  /** Override the key sequence for detaching a container. */
  DetachKeys?: string;
  /** A list of environment variables in the form ["VAR=value", ...]. */
  Env?: string[];
  /** Runs the exec process with extended privileges. */
  Privileged?: boolean;
  /** Allocate a pseudo-TTY. */
  Tty?: boolean;
  /** The user, and optionally, group to run the exec process inside the container. */
  User?: string;
  /** The working directory for the exec process inside the container. */
  WorkingDir?: string;
};

/** Options for starting an exec session. */
export type ExecStartConfig = {
  /** Detach from the command. */
  Detach?: boolean;
  /** Allocate a pseudo-TTY. */
  Tty?: boolean;
  /** Height of the TTY session in characters. */
  h?: number;
  /** Width of the TTY session in characters. */
  w?: number;
};

export interface ContainerChange {
  Path: string;
  Kind: number;
}
