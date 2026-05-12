/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxDeviceCgroup represents a device rule for the devices specified to
 * the device controller
 */
export type LinuxDeviceCgroup = {
  /**
   * Cgroup access permissions format, rwm.
   */
  access?: string;
  /**
   * Allow or deny
   */
  allow?: boolean;
  /**
   * Major is the device's major number.
   */
  major?: number;
  /**
   * Minor is the device's minor number.
   */
  minor?: number;
  /**
   * Device type, block, char, etc.
   */
  type?: string;
};
