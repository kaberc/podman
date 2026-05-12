/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxThrottleDevice struct holds a `major:minor rate_per_second` pair
 */
export type LinuxThrottleDevice = {
  /**
   * Major is the device's major number.
   */
  major?: number;
  /**
   * Minor is the device's minor number.
   */
  minor?: number;
  /**
   * Rate is the IO rate limit per cgroup per device
   */
  rate?: number;
};
