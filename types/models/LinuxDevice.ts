/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileMode } from "./FileMode.ts";
/**
 * LinuxDevice represents the mknod information for a Linux special device file
 */
export type LinuxDevice = {
  fileMode?: FileMode;
  /**
   * Gid of the device.
   */
  gid?: number;
  /**
   * Major is the device's major number.
   */
  major?: number;
  /**
   * Minor is the device's minor number.
   */
  minor?: number;
  /**
   * Path to the device.
   */
  path?: string;
  /**
   * Device type, block, char, etc.
   */
  type?: string;
  /**
   * UID of the device.
   */
  uid?: number;
};
