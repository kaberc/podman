/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerSize } from "./ContainerSize.ts";
import type { ListContainerNamespaces } from "./ListContainerNamespaces.ts";
import type { PortMapping } from "./PortMapping.ts";
/**
 * ListContainer describes a container suitable for listing
 */
export type ListContainer = {
  /**
   * AutoRemove
   */
  AutoRemove?: boolean;
  /**
   * CIDFile specified at creation time.
   */
  CIDFile?: string;
  /**
   * Container command
   */
  Command?: Array<string>;
  /**
   * Container creation time
   */
  Created?: string;
  /**
   * Human-readable container creation time.
   */
  CreatedAt?: string;
  /**
   * If container has exited, the return code from the command
   */
  ExitCode?: number;
  /**
   * If container has exited/stopped
   */
  Exited?: boolean;
  /**
   * Time container exited
   */
  ExitedAt?: number;
  /**
   * ExposedPorts contains the ports that are exposed but not forwarded,
   * see Ports for forwarded ports.
   * The key is the port number and the string slice contains the protocols,
   * i.e. "tcp", "udp" and "sctp".
   */
  ExposedPorts?: unknown;
  /**
   * The unique identifier for the container
   */
  Id?: string;
  /**
   * Container image
   */
  Image?: string;
  /**
   * Container image ID
   */
  ImageID?: string;
  /**
   * If this container is a Pod infra container
   */
  IsInfra?: boolean;
  /**
   * Labels for container
   */
  Labels?: Record<string, string>;
  /**
   * User volume mounts
   */
  Mounts?: Array<string>;
  /**
   * The names assigned to the container
   */
  Names?: Array<string>;
  Namespaces?: ListContainerNamespaces;
  /**
   * The network names assigned to the container
   */
  Networks?: Array<string>;
  /**
   * The process id of the container
   */
  Pid?: number;
  /**
   * If the container is part of Pod, the Pod ID. Requires the pod
   * boolean to be set
   */
  Pod?: string;
  /**
   * If the container is part of Pod, the Pod name. Requires the pod
   * boolean to be set
   */
  PodName?: string;
  /**
   * Port mappings
   */
  Ports?: Array<PortMapping>;
  /**
   * Restarts is how many times the container was restarted by its
   * restart policy. This is NOT incremented by normal container restarts
   * (only by restart policy).
   */
  Restarts?: number;
  Size?: ContainerSize;
  /**
   * Time when container started
   */
  StartedAt?: number;
  /**
   * State of container
   */
  State?: string;
  /**
   * Status is a human-readable approximation of a duration for json output
   */
  Status?: string;
};
