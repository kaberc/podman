/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerNetworkStats } from "./ContainerNetworkStats.ts";
import type { Duration } from "./Duration.ts";
/**
 * ContainerStats contains the statistics information for a running container
 */
export type ContainerStats = {
  AvgCPU?: number;
  BlockInput?: number;
  BlockOutput?: number;
  CPU?: number;
  CPUNano?: number;
  CPUSystemNano?: number;
  ContainerID?: string;
  Duration?: number;
  MemLimit?: number;
  MemPerc?: number;
  MemUsage?: number;
  Name?: string;
  /**
   * Map of interface name to network statistics for that interface.
   */
  Network?: Record<string, ContainerNetworkStats>;
  PIDs?: number;
  PerCPU?: Array<number>;
  SystemNano?: number;
  UpTime?: Duration;
};
