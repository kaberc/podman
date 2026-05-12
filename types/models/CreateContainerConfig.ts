/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthConfig } from "./HealthConfig.ts";
import type { HostConfig } from "./HostConfig.ts";
import type { NetworkingConfig } from "./NetworkingConfig.ts";
import type { PortSet } from "./PortSet.ts";
/**
 * CreateContainerConfig used when compatible endpoint creates a container
 */
export type CreateContainerConfig = {
  ArgsEscaped?: boolean;
  AttachStderr?: boolean;
  AttachStdin?: boolean;
  AttachStdout?: boolean;
  Cmd?: Array<string>;
  Domainname?: string;
  Entrypoint?: Array<string>;
  Env?: Array<string>;
  EnvMerge?: Array<string>;
  ExposedPorts?: PortSet;
  Healthcheck?: HealthConfig;
  HostConfig?: HostConfig;
  Hostname?: string;
  Image?: string;
  Labels?: Record<string, string>;
  MacAddress?: string;
  Name?: string;
  NetworkDisabled?: boolean;
  NetworkingConfig?: NetworkingConfig;
  OnBuild?: Array<string>;
  OpenStdin?: boolean;
  Shell?: Array<string>;
  StdinOnce?: boolean;
  StopSignal?: string;
  StopTimeout?: number;
  Tty?: boolean;
  UnsetEnv?: Array<string>;
  UnsetEnvAll?: boolean;
  User?: string;
  Volumes?: Record<string, Record<string, unknown>>;
  WorkingDir?: string;
};
