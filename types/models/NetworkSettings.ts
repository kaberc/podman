/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointSettings } from "./EndpointSettings.ts";
import type { PortMap } from "./PortMap.ts";
/**
 * NetworkSettings exposes the network settings in the api
 */
export type NetworkSettings = {
  Networks?: Record<string, EndpointSettings>;
  Ports?: PortMap;
  SandboxID?: string;
  SandboxKey?: string;
};
