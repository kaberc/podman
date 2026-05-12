/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxIntelRdt } from "./LinuxIntelRdt.ts";
import type { LinuxResources } from "./LinuxResources.ts";
import type { LinuxThrottleDevice } from "./LinuxThrottleDevice.ts";
import type { LinuxWeightDevice } from "./LinuxWeightDevice.ts";
import type { POSIXRlimit } from "./POSIXRlimit.ts";
export type ContainerResourceConfig = {
  intelRdt?: LinuxIntelRdt;
  /**
   * OOMScoreAdj adjusts the score used by the OOM killer to determine
   * processes to kill for the container's process.
   * Optional.
   */
  oom_score_adj?: number;
  /**
   * Rlimits are POSIX rlimits to apply to the container.
   * Optional.
   */
  r_limits?: Array<POSIXRlimit>;
  resource_limits?: LinuxResources;
  /**
   * IO read rate limit per cgroup per device, bytes per second
   */
  throttleReadBpsDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO read rate limit per cgroup per device, IO per second
   */
  throttleReadIOPSDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, bytes per second
   */
  throttleWriteBpsDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, IO per second
   */
  throttleWriteIOPSDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * CgroupConf are key-value options passed into the container runtime
   * that are used to configure cgroup v2.
   * Optional.
   */
  unified?: Record<string, string>;
  /**
   * Weight per cgroup per device, can override BlkioWeight
   */
  weightDevice?: Record<string, LinuxWeightDevice>;
};
