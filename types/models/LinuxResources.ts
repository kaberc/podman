/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxBlockIO } from "./LinuxBlockIO.ts";
import type { LinuxCPU } from "./LinuxCPU.ts";
import type { LinuxDeviceCgroup } from "./LinuxDeviceCgroup.ts";
import type { LinuxHugepageLimit } from "./LinuxHugepageLimit.ts";
import type { LinuxMemory } from "./LinuxMemory.ts";
import type { LinuxNetwork } from "./LinuxNetwork.ts";
import type { LinuxPids } from "./LinuxPids.ts";
import type { LinuxRdma } from "./LinuxRdma.ts";
/**
 * LinuxResources has container runtime resource constraints
 */
export type LinuxResources = {
  blockIO?: LinuxBlockIO;
  cpu?: LinuxCPU;
  /**
   * Devices configures the device allowlist.
   */
  devices?: Array<LinuxDeviceCgroup>;
  /**
   * Hugetlb limits (in bytes). Default to reservation limits if supported.
   */
  hugepageLimits?: Array<LinuxHugepageLimit>;
  memory?: LinuxMemory;
  network?: LinuxNetwork;
  pids?: LinuxPids;
  /**
   * Rdma resource restriction configuration.
   * Limits are a set of key value pairs that define RDMA resource limits,
   * where the key is device name and value is resource limits.
   */
  rdma?: Record<string, LinuxRdma>;
  /**
   * Unified resources.
   */
  unified?: Record<string, string>;
};
