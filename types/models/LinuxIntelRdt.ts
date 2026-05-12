/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxIntelRdt has container runtime resource constraints for Intel RDT CAT and MBA
 * features and flags enabling Intel RDT CMT and MBM features.
 * Intel RDT features are available in Linux 4.14 and newer kernel versions.
 */
export type LinuxIntelRdt = {
  /**
   * The identity for RDT Class of Service
   */
  closID?: string;
  /**
   * EnableCMT is the flag to indicate if the Intel RDT CMT is enabled. CMT (Cache Monitoring Technology) supports monitoring of
   * the last-level cache (LLC) occupancy for the container.
   */
  enableCMT?: boolean;
  /**
   * EnableMBM is the flag to indicate if the Intel RDT MBM is enabled. MBM (Memory Bandwidth Monitoring) supports monitoring of
   * total and local memory bandwidth for the container.
   */
  enableMBM?: boolean;
  /**
   * The schema for L3 cache id and capacity bitmask (CBM)
   * Format: "L3:<cache_id0>=<cbm0>;<cache_id1>=<cbm1>;..."
   */
  l3CacheSchema?: string;
  /**
   * The schema of memory bandwidth per L3 cache id
   * Format: "MB:<cache_id0>=bandwidth0;<cache_id1>=bandwidth1;..."
   * The unit of memory bandwidth is specified in "percentages" by
   * default, and in "MBps" if MBA Software Controller is enabled.
   */
  memBwSchema?: string;
};
