/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthcheckConfig } from "./HealthcheckConfig.ts";
import type { PortSet } from "./PortSet.ts";
import type { StrSlice } from "./StrSlice.ts";
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
  Cmd?: StrSlice;
  Domainname?: string;
  Entrypoint?: StrSlice;
  Env?: Array<string>;
  ExposedPorts?: PortSet;
  Healthcheck?: HealthcheckConfig;
  Hostname?: string;
  Image?: string;
  Labels?: Record<string, string>;
  /**
   * Mac Address of the container.
   *
   * Deprecated: this field is deprecated since API v1.44. Use EndpointSettings.MacAddress instead.
   */
  MacAddress?: string;
  NetworkDisabled?: boolean;
  OnBuild?: Array<string>;
  OpenStdin?: boolean;
  Shell?: StrSlice;
  StdinOnce?: boolean;
  StopSignal?: string;
  StopTimeout?: number;
  Tty?: boolean;
  User?: string;
  Volumes?: Record<string, Record<string, unknown>>;
  WorkingDir?: string;
};
