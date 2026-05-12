/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxCPU for Linux cgroup 'cpu' resource management
 */
export type LinuxCPU = {
  /**
   * CPU hardcap burst limit (in usecs). Allowed accumulated cpu time additionally for burst in a
   * given period.
   */
  burst?: number;
  /**
   * CPUs to use within the cpuset. Default is to use unknown CPU available.
   */
  cpus?: string;
  /**
   * cgroups are configured with minimum weight, 0: default behavior, 1: SCHED_IDLE.
   */
  idle?: number;
  /**
   * List of memory nodes in the cpuset. Default is to use unknown available memory node.
   */
  mems?: string;
  /**
   * CPU period to be used for hardcapping (in usecs).
   */
  period?: number;
  /**
   * CPU hardcap limit (in usecs). Allowed cpu time in a given period.
   */
  quota?: number;
  /**
   * CPU period to be used for realtime scheduling (in usecs).
   */
  realtimePeriod?: number;
  /**
   * How much time realtime scheduling may use (in usecs).
   */
  realtimeRuntime?: number;
  /**
   * CPU shares (relative weight (ratio) vs. other cgroups with cpu shares).
   */
  shares?: number;
};
