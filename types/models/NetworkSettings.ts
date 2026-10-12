/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointSettings } from "./EndpointSettings.ts";
import type { PortBinding } from "./PortBinding.ts";
/**
 * NetworkSettings exposes the network settings in the api
 */
export type NetworkSettings = {
  Networks?: Record<string, EndpointSettings>;
  /**
   * Ports is a collection of [network.PortBinding] indexed by [network.Port]
   */
  Ports?: Record<string, Array<PortBinding>>;
  SandboxID?: string;
  SandboxKey?: string;
};
