/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from "./Address.ts";
import type { EndpointSettings } from "./EndpointSettings.ts";
import type { PortMap } from "./PortMap.ts";
/**
 * NetworkSettings exposes the network settings in the api
 */
export type NetworkSettings = {
  Bridge?: string;
  /**
   * EndpointID uniquely represents a service endpoint in a Sandbox
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  EndpointID?: string;
  /**
   * Gateway holds the gateway address for the network
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  Gateway?: string;
  /**
   * GlobalIPv6Address holds network's global IPv6 address
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  GlobalIPv6Address?: string;
  /**
   * GlobalIPv6PrefixLen represents mask length of network's global IPv6 address
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  GlobalIPv6PrefixLen?: number;
  /**
   * HairpinMode specifies if hairpin NAT should be enabled on the virtual interface
   *
   * Deprecated: This field is never set and will be removed in a future release.
   */
  HairpinMode?: boolean;
  /**
   * IPAddress holds the IPv4 address for the network
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  IPAddress?: string;
  /**
   * IPPrefixLen represents mask length of network's IPv4 address
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  IPPrefixLen?: number;
  /**
   * IPv6Gateway holds gateway address specific for IPv6
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  IPv6Gateway?: string;
  /**
   * LinkLocalIPv6Address is an IPv6 unicast address using the link-local prefix
   *
   * Deprecated: This field is never set and will be removed in a future release.
   */
  LinkLocalIPv6Address?: string;
  /**
   * LinkLocalIPv6PrefixLen is the prefix length of an IPv6 unicast address
   *
   * Deprecated: This field is never set and will be removed in a future release.
   */
  LinkLocalIPv6PrefixLen?: number;
  /**
   * MacAddress holds the MAC address for the network
   *
   * Deprecated: This field will be removed in v29. You should look for the default network in NetworkSettings.Networks instead.
   */
  MacAddress?: string;
  Networks?: Record<string, EndpointSettings>;
  Ports?: PortMap;
  SandboxID?: string;
  SandboxKey?: string;
  SecondaryIPAddresses?: Array<Address>;
  SecondaryIPv6Addresses?: Array<Address>;
};
