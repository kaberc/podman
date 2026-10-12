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
   * EnableMonitoring enables resctrl monitoring for the container. This will
   * create a dedicated resctrl monitoring group for the container.
   */
  enableMonitoring?: boolean;
  /**
   * The schema for L3 cache id and capacity bitmask (CBM)
   * Format: "L3:<cache_id0>=<cbm0>;<cache_id1>=<cbm1>;..."
   * NOTE: Should not be specified if Schemata is non-empty.
   */
  l3CacheSchema?: string;
  /**
   * The schema of memory bandwidth per L3 cache id
   * Format: "MB:<cache_id0>=bandwidth0;<cache_id1>=bandwidth1;..."
   * The unit of memory bandwidth is specified in "percentages" by
   * default, and in "MBps" if MBA Software Controller is enabled.
   * NOTE: Should not be specified if Schemata is non-empty.
   */
  memBwSchema?: string;
  /**
   * Schemata specifies the complete schemata to be written as is to the
   * schemata file in resctrl fs. Each element represents a single line in the schemata file.
   * NOTE: This will overwrite schemas specified in the L3CacheSchema and/or
   * MemBwSchema fields.
   */
  schemata?: Array<string>;
};
