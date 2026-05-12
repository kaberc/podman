/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Route } from "./Route.ts";
import type { Subnet } from "./Subnet.ts";
export type Network = {
  /**
   * Created contains the timestamp when this network was created.
   */
  created?: string;
  /**
   * DNSEnabled is whether name resolution is active for container on
   * this Network. Only supported with the bridge driver.
   */
  dns_enabled?: boolean;
  /**
   * Driver for this Network, e.g. bridge, macvlan...
   */
  driver?: string;
  /**
   * ID of the Network.
   */
  id?: string;
  /**
   * Internal is whether the Network should not have external routes
   * to public or other Networks.
   */
  internal?: boolean;
  /**
   * IPAMOptions contains options used for the ip assignment.
   */
  ipam_options?: Record<string, string>;
  /**
   * IPv6Enabled if set to true an ipv6 subnet should be created for this net.
   */
  ipv6_enabled?: boolean;
  /**
   * Labels is a set of key-value labels that have been applied to the
   * Network.
   */
  labels?: Record<string, string>;
  /**
   * Name of the Network.
   */
  name?: string;
  /**
   * List of custom DNS server for podman's DNS resolver at network level,
   * all the containers attached to this network will consider resolvers
   * configured at network level.
   */
  network_dns_servers?: Array<string>;
  /**
   * NetworkInterface is the network interface name on the host.
   */
  network_interface?: string;
  /**
   * Options is a set of key-value options that have been applied to
   * the Network.
   */
  options?: Record<string, string>;
  /**
   * Routes to use for this network.
   */
  routes?: Array<Route>;
  /**
   * Subnets to use for this network.
   */
  subnets?: Array<Subnet>;
};
