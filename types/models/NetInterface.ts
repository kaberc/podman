/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NetAddress } from "./NetAddress.ts";
export type NetInterface = {
  /**
   * MacAddress for this Interface.
   */
  mac_address?: string;
  /**
   * Subnets list of assigned subnets with their gateway.
   */
  subnets?: Array<NetAddress>;
};
