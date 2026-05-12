/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectBlkioThrottleDevice holds information about a speed cap for a device
 * node. This cap applies to a specific operation (read, write, etc) on the given
 * node.
 */
export type InspectBlkioThrottleDevice = {
  /**
   * Path is the path to the device this applies to.
   */
  Path?: string;
  /**
   * Rate is the maximum rate. It is in either bytes per second or iops
   * per second, determined by where it is used - documentation will
   * indicate which is appropriate.
   */
  Rate?: number;
};
