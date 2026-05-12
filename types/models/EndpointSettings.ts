/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointIPAMConfig } from "./EndpointIPAMConfig.ts";
/**
 * EndpointSettings stores the network endpoint details
 */
export type EndpointSettings = {
  Aliases?: Array<string>;
  /**
   * DNSNames holds all the (non fully qualified) DNS names associated to this endpoint. First entry is used to
   * generate PTR records.
   */
  DNSNames?: Array<string>;
  DriverOpts?: Record<string, string>;
  EndpointID?: string;
  Gateway?: string;
  GlobalIPv6Address?: string;
  GlobalIPv6PrefixLen?: number;
  /**
   * GwPriority determines which endpoint will provide the default gateway
   * for the container. The endpoint with the highest priority will be used.
   * If multiple endpoints have the same priority, they are lexicographically
   * sorted based on their network name, and the one that sorts first is picked.
   */
  GwPriority?: number;
  IPAMConfig?: EndpointIPAMConfig;
  IPAddress?: string;
  IPPrefixLen?: number;
  IPv6Gateway?: string;
  Links?: Array<string>;
  /**
   * MacAddress may be used to specify a MAC address when the container is created.
   * Once the container is running, it becomes operational data (it may contain a
   * generated address).
   */
  MacAddress?: string;
  /**
   * Operational data
   */
  NetworkID?: string;
};
