/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlkiodevThrottleDevice } from "./BlkiodevThrottleDevice.ts";
import type { BlkiodevWeightDevice } from "./BlkiodevWeightDevice.ts";
import type { DeviceMapping } from "./DeviceMapping.ts";
import type { DeviceRequest } from "./DeviceRequest.ts";
import type { RestartPolicy } from "./RestartPolicy.ts";
import type { Ulimit } from "./Ulimit.ts";
/**
 * Those attributes can be updated at runtime.
 */
export type UpdateConfig = {
  BlkioDeviceReadBps?: Array<BlkiodevThrottleDevice>;
  BlkioDeviceReadIOps?: Array<BlkiodevThrottleDevice>;
  BlkioDeviceWriteBps?: Array<BlkiodevThrottleDevice>;
  BlkioDeviceWriteIOps?: Array<BlkiodevThrottleDevice>;
  BlkioWeight?: number;
  BlkioWeightDevice?: Array<BlkiodevWeightDevice>;
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
  RestartPolicy?: RestartPolicy;
  Ulimits?: Array<Ulimit>;
};
