/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Config } from "./Config.ts";
import type { Descriptor } from "./Descriptor.ts";
import type { DriverData } from "./DriverData.ts";
import type { HostConfig } from "./HostConfig.ts";
import type { MountPoint } from "./MountPoint.ts";
import type { NetworkSettings } from "./NetworkSettings.ts";
import type { State } from "./State.ts";
/**
 * endpoint.
 */
export type InspectResponse = {
  AppArmorProfile?: string;
  Args?: Array<string>;
  Config?: Config;
  Created?: string;
  Driver?: string;
  ExecIDs?: Array<string>;
  GraphDriver?: DriverData;
  HostConfig?: HostConfig;
  HostnamePath?: string;
  HostsPath?: string;
  Id?: string;
  Image?: string;
  ImageManifestDescriptor?: Descriptor;
  LogPath?: string;
  MountLabel?: string;
  Mounts?: Array<MountPoint>;
  Name?: string;
  NetworkSettings?: NetworkSettings;
  Path?: string;
  Platform?: string;
  ProcessLabel?: string;
  ResolvConfPath?: string;
  RestartCount?: number;
  SizeRootFs?: number;
  SizeRw?: number;
  State?: State;
};
