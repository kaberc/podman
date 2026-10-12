/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefineVersion } from "./DefineVersion.ts";
import type { HostInfo } from "./HostInfo.ts";
import type { Plugins } from "./Plugins.ts";
import type { StoreInfo } from "./StoreInfo.ts";
/**
 * Info is the overall struct that describes the host system
 * running libpod/podman
 */
export type LibpodInfo = {
  host?: HostInfo;
  plugins?: Plugins;
  registries?: Record<string, unknown>;
  store?: StoreInfo;
  version?: DefineVersion;
};
