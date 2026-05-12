/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CgroupnsMode } from "./CgroupnsMode.ts";
import type { CgroupSpec } from "./CgroupSpec.ts";
import type { DeviceMapping } from "./DeviceMapping.ts";
import type { DeviceRequest } from "./DeviceRequest.ts";
import type { IpcMode } from "./IpcMode.ts";
import type { Isolation } from "./Isolation.ts";
import type { LogConfig } from "./LogConfig.ts";
import type { Mount } from "./Mount.ts";
import type { NetworkMode } from "./NetworkMode.ts";
import type { PidMode } from "./PidMode.ts";
import type { PortMap } from "./PortMap.ts";
import type { RestartPolicy } from "./RestartPolicy.ts";
import type { ThrottleDevice } from "./ThrottleDevice.ts";
import type { Ulimit } from "./Ulimit.ts";
import type { UsernsMode } from "./UsernsMode.ts";
import type { UTSMode } from "./UTSMode.ts";
import type { WeightDevice } from "./WeightDevice.ts";
/**
 * Here, "non-portable" means "dependent of the host we are running on".
 * Portable information *should* appear in Config.
 */
export type HostConfig = {
  Annotations?: Record<string, string>;
  AutoRemove?: boolean;
  /**
   * Applicable to all platforms
   */
  Binds?: Array<string>;
  BlkioDeviceReadBps?: Array<ThrottleDevice>;
  BlkioDeviceReadIOps?: Array<ThrottleDevice>;
  BlkioDeviceWriteBps?: Array<ThrottleDevice>;
  BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
  BlkioWeight?: number;
  BlkioWeightDevice?: Array<WeightDevice>;
  /**
   * Applicable to UNIX platforms
   */
  CapAdd?: Array<string>;
  CapDrop?: Array<string>;
  Cgroup?: CgroupSpec;
  /**
   * Applicable to UNIX platforms
   */
  CgroupParent?: string;
  CgroupnsMode?: CgroupnsMode;
  ConsoleSize?: Array<number>;
  ContainerIDFile?: string;
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
  Dns?: Array<string>;
  DnsOptions?: Array<string>;
  DnsSearch?: Array<string>;
  ExtraHosts?: Array<string>;
  GroupAdd?: Array<string>;
  IOMaximumBandwidth?: number;
  IOMaximumIOps?: number;
  /**
   * Run a custom init inside the container, if null, use the daemon's configured settings
   */
  Init?: boolean;
  IpcMode?: IpcMode;
  Isolation?: Isolation;
  Links?: Array<string>;
  LogConfig?: LogConfig;
  /**
   * MaskedPaths is the list of paths to be masked inside the container (this overrides the default set of paths)
   */
  MaskedPaths?: Array<string>;
  Memory?: number;
  MemoryReservation?: number;
  MemorySwap?: number;
  MemorySwappiness?: number;
  /**
   * Mounts specs used by the container
   */
  Mounts?: Array<Mount>;
  NanoCpus?: number;
  NetworkMode?: NetworkMode;
  OomKillDisable?: boolean;
  OomScoreAdj?: number;
  PidMode?: PidMode;
  PidsLimit?: number;
  PortBindings?: PortMap;
  Privileged?: boolean;
  PublishAllPorts?: boolean;
  /**
   * ReadonlyPaths is the list of paths to be set as read-only inside the container (this overrides the default set of paths)
   */
  ReadonlyPaths?: Array<string>;
  ReadonlyRootfs?: boolean;
  RestartPolicy?: RestartPolicy;
  Runtime?: string;
  SecurityOpt?: Array<string>;
  ShmSize?: number;
  StorageOpt?: Record<string, string>;
  Sysctls?: Record<string, string>;
  Tmpfs?: Record<string, string>;
  UTSMode?: UTSMode;
  Ulimits?: Array<Ulimit>;
  UsernsMode?: UsernsMode;
  VolumeDriver?: string;
  VolumesFrom?: Array<string>;
};
