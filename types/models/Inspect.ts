/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigReference } from "./ConfigReference.ts";
import type { EndpointResource } from "./EndpointResource.ts";
import type { IPAM } from "./IPAM.ts";
import type { PeerInfo } from "./PeerInfo.ts";
import type { ServiceInfo } from "./ServiceInfo.ts";
import type { Status } from "./Status.ts";
export type Inspect = {
  /**
   * Whether a global / swarm scope network is manually attachable by regular
   * containers from workers in swarm mode.
   */
  Attachable?: boolean;
  ConfigFrom?: ConfigReference;
  /**
   * Whether the network is a config-only network. Config-only networks are
   * placeholder networks for network configurations to be used by other
   * networks. Config-only networks cannot be used directly to run containers
   * or services.
   */
  ConfigOnly?: boolean;
  /**
   * Contains endpoints attached to the network.
   */
  Containers?: Record<string, EndpointResource>;
  /**
   * Date and time at which the network was created in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   */
  Created?: string;
  /**
   * The name of the driver used to create the network (e.g. `bridge`,
   * `overlay`).
   */
  Driver?: string;
  /**
   * Whether the network was created with IPv4 enabled.
   */
  EnableIPv4?: boolean;
  /**
   * Whether the network was created with IPv6 enabled.
   */
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  /**
   * ID that uniquely identifies a network on a single machine.
   */
  Id?: string;
  /**
   * Whether the network is providing the routing-mesh for the swarm cluster.
   */
  Ingress?: boolean;
  /**
   * Whether the network is created to only allow internal networking
   * connectivity.
   */
  Internal?: boolean;
  /**
   * Metadata specific to the network being created.
   */
  Labels?: Record<string, string>;
  /**
   * Name of the network.
   */
  Name?: string;
  /**
   * Network-specific options uses when creating the network.
   */
  Options?: Record<string, string>;
  /**
   * List of peer nodes for an overlay network. This field is only present
   * for overlay networks, and omitted for other network types.
   */
  Peers?: Array<PeerInfo>;
  /**
   * The level at which the network exists (e.g. `swarm` for cluster-wide
   * or `local` for machine level)
   */
  Scope?: string;
  /**
   * List of services using the network. This field is only present for
   * swarm scope networks, and omitted for local scope networks.
   */
  Services?: Record<string, ServiceInfo>;
  Status?: Status;
};
