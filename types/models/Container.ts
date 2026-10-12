/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerState } from "./ContainerState.ts";
import type { Descriptor } from "./Descriptor.ts";
import type { HealthSummary } from "./HealthSummary.ts";
import type { MountPoint } from "./MountPoint.ts";
import type { NetworkSettingsSummary } from "./NetworkSettingsSummary.ts";
import type { PortSummary } from "./PortSummary.ts";
export type Container = {
  Command?: string;
  Created?: number;
  Health?: HealthSummary;
  HostConfig?: {
    Annotations?: Record<string, string>;
    NetworkMode?: string;
  };
  Id?: string;
  Image?: string;
  ImageID?: string;
  ImageManifestDescriptor?: Descriptor;
  Labels?: Record<string, string>;
  Mounts?: Array<MountPoint>;
  Names?: Array<string>;
  NetworkSettings?: NetworkSettingsSummary;
  Ports?: Array<PortSummary>;
  SizeRootFs?: number;
  SizeRw?: number;
  State?: ContainerState;
  Status?: string;
};
