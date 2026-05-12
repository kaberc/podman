/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InspectBlkioThrottleDevice } from "./InspectBlkioThrottleDevice.ts";
import type { InspectBlkioWeightDevice } from "./InspectBlkioWeightDevice.ts";
import type { InspectDevice } from "./InspectDevice.ts";
import type { InspectMount } from "./InspectMount.ts";
import type { InspectPodContainerInfo } from "./InspectPodContainerInfo.ts";
import type { InspectPodInfraConfig } from "./InspectPodInfraConfig.ts";
/**
 * InspectPodData contains detailed information on a pod's configuration and
 * state. It is used as the output of Inspect on pods.
 */
export type InspectPodData = {
  /**
   * CgroupParent is the parent of the pod's Cgroup.
   */
  CgroupParent?: string;
  /**
   * CgroupPath is the path to the pod's Cgroup.
   */
  CgroupPath?: string;
  /**
   * Containers gives a brief summary of all containers in the pod and
   * their current status.
   */
  Containers?: Array<InspectPodContainerInfo>;
  /**
   * CreateCgroup is whether this pod will create its own Cgroup to group
   * containers under.
   */
  CreateCgroup?: boolean;
  /**
   * CreateCommand is the full command plus arguments of the process the
   * container has been created with.
   */
  CreateCommand?: Array<string>;
  /**
   * CreateInfra is whether this pod will create an infra container to
   * share namespaces.
   */
  CreateInfra?: boolean;
  /**
   * Created is the time when the pod was created.
   */
  Created?: string;
  /**
   * ExitPolicy of the pod.
   */
  ExitPolicy?: string;
  /**
   * Hostname is the hostname that the pod will set.
   */
  Hostname?: string;
  /**
   * ID is the ID of the pod.
   */
  Id?: string;
  InfraConfig?: InspectPodInfraConfig;
  /**
   * InfraContainerID is the ID of the pod's infra container, if one is
   * present.
   */
  InfraContainerID?: string;
  /**
   * Labels is a set of key-value labels that have been applied to the
   * pod.
   */
  Labels?: Record<string, string>;
  /**
   * Number of the pod's Libpod lock.
   */
  LockNumber?: number;
  /**
   * Name is the name of the pod.
   */
  Name?: string;
  /**
   * Namespace is the Libpod namespace the pod is placed in.
   */
  Namespace?: string;
  /**
   * NumContainers is the number of containers in the pod, including the
   * infra container.
   */
  NumContainers?: number;
  /**
   * RestartPolicy of the pod.
   */
  RestartPolicy?: string;
  /**
   * SharedNamespaces contains a list of namespaces that will be shared by
   * containers within the pod. Can only be set if CreateInfra is true.
   */
  SharedNamespaces?: Array<string>;
  /**
   * State represents the current state of the pod.
   */
  State?: string;
  /**
   * BlkioWeight contains the blkio weight limit for the pod
   */
  blkio_weight?: number;
  /**
   * BlkioWeightDevice contains the blkio weight device limits for the pod
   */
  blkio_weight_device?: Array<InspectBlkioWeightDevice>;
  /**
   * CPUPeriod contains the CPU period of the pod
   */
  cpu_period?: number;
  /**
   * CPUQuota contains the CPU quota of the pod
   */
  cpu_quota?: number;
  /**
   * CPUShares contains the cpu shares for the pod
   */
  cpu_shares?: number;
  /**
   * CPUSetCPUs contains linux specific CPU data for the pod
   */
  cpuset_cpus?: string;
  /**
   * CPUSetMems contains linux specific CPU data for the pod
   */
  cpuset_mems?: string;
  /**
   * BlkioDeviceReadBps contains the Read/Access limit for the pod's devices
   */
  device_read_bps?: Array<InspectBlkioThrottleDevice>;
  /**
   * BlkioDeviceReadBps contains the Read/Access limit for the pod's devices
   */
  device_write_bps?: Array<InspectBlkioThrottleDevice>;
  /**
   * Devices contains the specified host devices
   */
  devices?: Array<InspectDevice>;
  /**
   * MemoryLimit contains the specified cgroup memory limit for the pod
   */
  memory_limit?: number;
  /**
   * MemorySwap contains the specified memory swap limit for the pod
   */
  memory_swap?: number;
  /**
   * Mounts contains volume related information for the pod
   */
  mounts?: Array<InspectMount>;
  /**
   * SecurityOpt contains the specified security labels and related SELinux information
   */
  security_opt?: Array<string>;
  /**
   * VolumesFrom contains the containers that the pod inherits mounts from
   */
  volumes_from?: Array<string>;
};
