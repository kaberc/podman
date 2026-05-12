/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConmonInfo } from "./ConmonInfo.ts";
import type { CPUUsage } from "./CPUUsage.ts";
import type { DistributionInfo } from "./DistributionInfo.ts";
import type { IDMappings } from "./IDMappings.ts";
import type { NetworkInfo } from "./NetworkInfo.ts";
import type { OCIRuntimeInfo } from "./OCIRuntimeInfo.ts";
import type { PastaInfo } from "./PastaInfo.ts";
import type { RemoteSocket } from "./RemoteSocket.ts";
import type { SecurityInfo } from "./SecurityInfo.ts";
import type { SlirpInfo } from "./SlirpInfo.ts";
/**
 * HostInfo describes the libpod host
 */
export type HostInfo = {
  arch?: string;
  buildahVersion?: string;
  cgroupControllers?: Array<string>;
  cgroupManager?: string;
  cgroupVersion?: string;
  conmon?: ConmonInfo;
  cpuUtilization?: CPUUsage;
  cpus?: number;
  databaseBackend?: string;
  distribution?: DistributionInfo;
  emulatedArchitectures?: Array<string>;
  eventLogger?: string;
  freeLocks?: number;
  hostname?: string;
  idMappings?: IDMappings;
  kernel?: string;
  linkmode?: string;
  logDriver?: string;
  memFree?: number;
  memTotal?: number;
  networkBackend?: string;
  networkBackendInfo?: NetworkInfo;
  ociRuntime?: OCIRuntimeInfo;
  os?: string;
  pasta?: PastaInfo;
  remoteSocket?: RemoteSocket;
  /**
   * RootlessNetworkCmd returns the default rootless network command (slirp4netns or pasta)
   */
  rootlessNetworkCmd?: string;
  runtimeInfo?: Record<string, unknown>;
  security?: SecurityInfo;
  /**
   * ServiceIsRemote is true when the podman/libpod service is remote to the client
   */
  serviceIsRemote?: boolean;
  slirp4netns?: SlirpInfo;
  swapFree?: number;
  swapTotal?: number;
  uptime?: string;
  variant?: string;
};
