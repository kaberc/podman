/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthConfig } from "./HealthConfig.ts";
import type { PortSet } from "./PortSet.ts";
/**
 * It should hold only portable information about the container.
 * Here, "portable" means "independent from the host we are running on".
 * Non-portable information *should* appear in HostConfig.
 * All fields added to this struct must be marked `omitempty` to keep getting
 * predictable hashes from the old `v1Compatibility` configuration.
 */
export type Config = {
  ArgsEscaped?: boolean;
  AttachStderr?: boolean;
  AttachStdin?: boolean;
  AttachStdout?: boolean;
  Cmd?: Array<string>;
  Domainname?: string;
  Entrypoint?: Array<string>;
  Env?: Array<string>;
  ExposedPorts?: PortSet;
  Healthcheck?: HealthConfig;
  Hostname?: string;
  Image?: string;
  Labels?: Record<string, string>;
  NetworkDisabled?: boolean;
  OnBuild?: Array<string>;
  OpenStdin?: boolean;
  Shell?: Array<string>;
  StdinOnce?: boolean;
  StopSignal?: string;
  StopTimeout?: number;
  Tty?: boolean;
  User?: string;
  Volumes?: Record<string, Record<string, unknown>>;
  WorkingDir?: string;
};
