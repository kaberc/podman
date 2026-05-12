/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from "./Address.ts";
/**
 * InspectAdditionalNetwork holds information about non-default networks the
 * container has been connected to.
 * As with InspectNetworkSettings, many fields are unused and maintained only
 * for compatibility with Docker.
 */
export type InspectAdditionalNetwork = {
  /**
   * AdditionalMacAddresses is a set of additional MAC Addresses beyond
   * the first. The network backend may configure more than one interface
   * for a single network, which can cause this.
   */
  AdditionalMACAddresses?: Array<string>;
  /**
   * Aliases are unknown network aliases the container has in this network.
   */
  Aliases?: Array<string>;
  /**
   * DriverOpts is presently unused and maintained exclusively for
   * compatibility.
   */
  DriverOpts?: Record<string, string>;
  /**
   * EndpointID is unused, maintained exclusively for compatibility.
   */
  EndpointID?: string;
  /**
   * Gateway is the IP address of the gateway this network will use.
   */
  Gateway?: string;
  /**
   * GlobalIPv6Address is the global-scope IPv6 Address for this network.
   */
  GlobalIPv6Address?: string;
  /**
   * GlobalIPv6PrefixLen is the length of the subnet mask of this network.
   */
  GlobalIPv6PrefixLen?: number;
  /**
   * IPAMConfig is presently unused and maintained exclusively for
   * compatibility.
   */
  IPAMConfig?: Record<string, string>;
  /**
   * IPAddress is the IP address for this network.
   */
  IPAddress?: string;
  /**
   * IPPrefixLen is the length of the subnet mask of this network.
   */
  IPPrefixLen?: number;
  /**
   * IPv6Gateway is the IPv6 gateway this network will use.
   */
  IPv6Gateway?: string;
  /**
   * Links is presently unused and maintained exclusively for
   * compatibility.
   */
  Links?: Array<string>;
  /**
   * MacAddress is the MAC address for the interface in this network.
   */
  MacAddress?: string;
  /**
   * Name of the network we're connecting to.
   */
  NetworkID?: string;
  /**
   * SecondaryIPAddresses is a list of extra IP Addresses that the
   * container has been assigned in this network.
   */
  SecondaryIPAddresses?: Array<Address>;
  /**
   * SecondaryIPv6Addresses is a list of extra IPv6 Addresses that the
   * container has been assigned in this network.
   */
  SecondaryIPv6Addresses?: Array<Address>;
};
