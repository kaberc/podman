/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverData } from "./DriverData.ts";
import type { InspectContainerConfig } from "./InspectContainerConfig.ts";
import type { InspectContainerHostConfig } from "./InspectContainerHostConfig.ts";
import type { InspectContainerState } from "./InspectContainerState.ts";
import type { InspectMount } from "./InspectMount.ts";
import type { InspectNetworkSettings } from "./InspectNetworkSettings.ts";
/**
 * InspectContainerData provides a detailed record of a container's configuration
 * and state as viewed by Libpod.
 * Large portions of this structure are defined such that the output is
 * compatible with `docker inspect` JSON, but additional fields have been added
 * as required to share information not in the original output.
 */
export type InspectContainerData = {
  AppArmorProfile?: string;
  Args?: Array<string>;
  BoundingCaps?: Array<string>;
  Config?: InspectContainerConfig;
  ConmonPidFile?: string;
  Created?: string;
  Dependencies?: Array<string>;
  Driver?: string;
  EffectiveCaps?: Array<string>;
  ExecIDs?: Array<string>;
  GraphDriver?: DriverData;
  HostConfig?: InspectContainerHostConfig;
  HostnamePath?: string;
  HostsPath?: string;
  Id?: string;
  Image?: string;
  ImageDigest?: string;
  ImageName?: string;
  IsInfra?: boolean;
  IsService?: boolean;
  KubeExitCodePropagation?: string;
  MountLabel?: string;
  Mounts?: Array<InspectMount>;
  Name?: string;
  Namespace?: string;
  NetworkSettings?: InspectNetworkSettings;
  OCIConfigPath?: string;
  OCIRuntime?: string;
  Path?: string;
  PidFile?: string;
  Pod?: string;
  ProcessLabel?: string;
  ResolvConfPath?: string;
  RestartCount?: number;
  Rootfs?: string;
  SizeRootFs?: number;
  SizeRw?: number;
  State?: InspectContainerState;
  StaticDir?: string;
  UseImageHostname?: boolean;
  UseImageHosts?: boolean;
  lockNumber?: number;
};
