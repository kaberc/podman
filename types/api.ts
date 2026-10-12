// Friendly aliases for awkwardly-named schemas, custom types not in the OpenAPI spec,
// and schema overrides. Query param types are auto-generated in queries.ts.
//
// Run `deno task generate-types` to regenerate split OpenAPI types from Podman's swagger spec.

// Re-export all auto-generated schema and query types so importers only need this file.
export type * from "./models/index.ts";
export type * from "./queries.ts";

import type {
  ComponentVersion,
  ContainersPruneReportLibpod,
  ContainerTopOKBody,
  HistoryResponse,
  ImageSearchReport,
  LibpodImageSummary,
  networkCreateLibpod,
  networkDisconnectRequest,
  ReportsPruneReport,
  Schema2ListPublic as _Schema2ListPublic,
  SecretInfoReport as _SecretInfoReport,
  SpecsGoMount,
} from "./models/index.ts";

// ─── Schema renames (spec name → friendly name) ───

export type ContainerTopResponse = ContainerTopOKBody;
export type ContainersPruneReport = ContainersPruneReportLibpod;
export type ImageSummary = LibpodImageSummary;
export type ImageRemoveReport = {
  Deleted?: string[];
  Untagged?: string[];
  Errors?: string[];
  ExitCode?: number;
};
export type ImageHistory = HistoryResponse;
export type ImagePruneReport = ReportsPruneReport;
/** The libpod endpoint returns per-volume reports, not the Docker prune summary. */
export type VolumePruneReport = ReportsPruneReport;
export type NetworkCreateOptions = networkCreateLibpod;
export type NetworkDisconnectOptions = networkDisconnectRequest;

export type PlayKubeResourceReport = {
  ID?: string;
  Name?: string;
  [key: string]: unknown;
};

export type PlayKubeReport = {
  Pods?: PlayKubeResourceReport[];
  Containers?: PlayKubeResourceReport[];
  Volumes?: PlayKubeResourceReport[];
  Secrets?: PlayKubeResourceReport[];
  Services?: PlayKubeResourceReport[];
  ServiceContainerID?: string;
  ExitCode?: number;
  [key: string]: unknown;
};

export type ManifestDescriptor = {
  mediaType?: string;
  digest?: string;
  size?: number;
  platform?: {
    architecture?: string;
    os?: string;
    variant?: string;
    [key: string]: unknown;
  };
  annotations?: Record<string, string>;
  urls?: string[];
  [key: string]: unknown;
};

export type Schema2ListPublic = Omit<_Schema2ListPublic, "manifests"> & {
  manifests?: ManifestDescriptor[];
};
export type SecretInfoReport = _SecretInfoReport & {
  Spec?: { Name?: string; [key: string]: unknown };
};
export type SystemComponentVersion = ComponentVersion & {
  Version?: string;
};

// ─── Compatibility aliases ───

/** OCI runtime-spec mount, as accepted by `SpecGenerator.mounts`. */
export type OciMount = SpecsGoMount;

// ─── Response-derived types ───

export type ImageSearchResult = ImageSearchReport;

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
