/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxWeightDevice struct holds a `major:minor weight` pair for weightDevice
 */
export type LinuxWeightDevice = {
  /**
   * LeafWeight is the bandwidth rate for the device while competing with the cgroup's child cgroups, CFQ scheduler only
   */
  leafWeight?: number;
  /**
   * Major is the device's major number.
   */
  major?: number;
  /**
   * Minor is the device's minor number.
   */
  minor?: number;
  /**
   * Weight is the bandwidth rate for the device.
   */
  weight?: number;
};
