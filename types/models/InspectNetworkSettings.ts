/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from "./Address.ts";
import type { InspectAdditionalNetwork } from "./InspectAdditionalNetwork.ts";
import type { InspectHostPort } from "./InspectHostPort.ts";
/**
 * InspectNetworkSettings holds information about the network settings of the
 * container.
 * Many fields are maintained only for compatibility with `docker inspect` and
 * are unused within Libpod.
 */
export type InspectNetworkSettings = {
  /**
   * AdditionalMacAddresses is a set of additional MAC Addresses beyond
   * the first. CNI may configure more than one interface for a single
   * network, which can cause this.
   */
  AdditionalMACAddresses?: Array<string>;
  Bridge?: string;
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
  HairpinMode?: boolean;
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
  LinkLocalIPv6Address?: string;
  LinkLocalIPv6PrefixLen?: number;
  /**
   * MacAddress is the MAC address for the interface in this network.
   */
  MacAddress?: string;
  /**
   * Networks contains information on non-default networks this
   * container has joined.
   * It is a map of network name to network information.
   */
  Networks?: Record<string, InspectAdditionalNetwork>;
  Ports?: Record<string, Array<InspectHostPort>>;
  SandboxID?: string;
  SandboxKey?: string;
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
