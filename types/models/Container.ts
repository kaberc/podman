/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Config } from "./Config.ts";
import type { Descriptor } from "./Descriptor.ts";
import type { HostConfig } from "./HostConfig.ts";
import type { MountPoint } from "./MountPoint.ts";
import type { NetworkingConfig } from "./NetworkingConfig.ts";
import type { NetworkSettingsSummary } from "./NetworkSettingsSummary.ts";
import type { Platform } from "./Platform.ts";
import type { Port } from "./Port.ts";
export type Container = {
  Command?: string;
  Config?: Config;
  Created?: number;
  DefaultReadOnlyNonRecursive?: boolean;
  HostConfig?: HostConfig;
  Id?: string;
  Image?: string;
  ImageID?: string;
  ImageManifestDescriptor?: Descriptor;
  Labels?: Record<string, string>;
  Mounts?: Array<MountPoint>;
  Name?: string;
  Names?: Array<string>;
  NetworkSettings?: NetworkSettingsSummary;
  NetworkingConfig?: NetworkingConfig;
  Platform?: Platform;
  Ports?: Array<Port>;
  SizeRootFs?: number;
  SizeRw?: number;
  State?: string;
  Status?: string;
};
