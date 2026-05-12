/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxThrottleDevice } from "./LinuxThrottleDevice.ts";
import type { LinuxWeightDevice } from "./LinuxWeightDevice.ts";
/**
 * LinuxBlockIO for Linux cgroup 'blkio' resource management
 */
export type LinuxBlockIO = {
  /**
   * Specifies tasks' weight in the given cgroup while competing with the cgroup's child cgroups, CFQ scheduler only
   */
  leafWeight?: number;
  /**
   * IO read rate limit per cgroup per device, bytes per second
   */
  throttleReadBpsDevice?: Array<LinuxThrottleDevice>;
  /**
   * IO read rate limit per cgroup per device, IO per second
   */
  throttleReadIOPSDevice?: Array<LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, bytes per second
   */
  throttleWriteBpsDevice?: Array<LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, IO per second
   */
  throttleWriteIOPSDevice?: Array<LinuxThrottleDevice>;
  /**
   * Specifies per cgroup weight
   */
  weight?: number;
  /**
   * Weight per cgroup per device, can override BlkioWeight
   */
  weightDevice?: Array<LinuxWeightDevice>;
};
