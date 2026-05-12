/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceMapping } from "./DeviceMapping.ts";
import type { DeviceRequest } from "./DeviceRequest.ts";
import type { ThrottleDevice } from "./ThrottleDevice.ts";
import type { Ulimit } from "./Ulimit.ts";
import type { WeightDevice } from "./WeightDevice.ts";
/**
 * Resources contains container's resources (cgroups config, ulimits...)
 */
export type Resources = {
  BlkioDeviceReadBps?: Array<ThrottleDevice>;
  BlkioDeviceReadIOps?: Array<ThrottleDevice>;
  BlkioDeviceWriteBps?: Array<ThrottleDevice>;
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
  BlkioWeight?: number;
  BlkioWeightDevice?: Array<WeightDevice>;
  /**
   * Applicable to UNIX platforms
   */
  CgroupParent?: string;
  /**
   * Applicable to Windows
   */
  CpuCount?: number;
  CpuPercent?: number;
  CpuPeriod?: number;
  CpuQuota?: number;
  CpuRealtimePeriod?: number;
  CpuRealtimeRuntime?: number;
  /**
   * Applicable to all platforms
   */
  CpuShares?: number;
  CpusetCpus?: string;
  CpusetMems?: string;
  DeviceCgroupRules?: Array<string>;
  DeviceRequests?: Array<DeviceRequest>;
  Devices?: Array<DeviceMapping>;
  IOMaximumBandwidth?: number;
  IOMaximumIOps?: number;
  Memory?: number;
  MemoryReservation?: number;
  MemorySwap?: number;
  MemorySwappiness?: number;
  NanoCpus?: number;
  OomKillDisable?: boolean;
  PidsLimit?: number;
  Ulimits?: Array<Ulimit>;
};
