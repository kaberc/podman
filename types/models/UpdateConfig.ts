/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceMapping } from "./DeviceMapping.ts";
import type { DeviceRequest } from "./DeviceRequest.ts";
import type { RestartPolicy } from "./RestartPolicy.ts";
import type { ThrottleDevice } from "./ThrottleDevice.ts";
import type { Ulimit } from "./Ulimit.ts";
import type { WeightDevice } from "./WeightDevice.ts";
/**
 * Those attributes can be updated at runtime.
 */
export type UpdateConfig = {
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
  /**
   * KernelMemory specifies the kernel memory limit (in bytes) for the container.
   * Deprecated: kernel 5.4 deprecated kmem.limit_in_bytes.
   */
  KernelMemory?: number;
  /**
   * Hard limit for kernel TCP buffer memory (in bytes).
   *
   * Deprecated: This field is deprecated and will be removed in the next release.
   * Starting with 6.12, the kernel has deprecated kernel memory tcp accounting
   * for cgroups v1.
   */
  KernelMemoryTCP?: number;
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
