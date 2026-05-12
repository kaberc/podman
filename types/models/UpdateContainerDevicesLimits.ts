/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThrottleDevice } from "./ThrottleDevice.ts";
import type { WeightDevice } from "./WeightDevice.ts";
export type UpdateContainerDevicesLimits = {
  /**
   * Block IO weight (relative device weight) in the form:
   * ```[{"Path": "device_path", "Weight": weight}]```
   */
  BlkIOWeightDevice?: Array<WeightDevice>;
  /**
   * Limit read rate (bytes per second) from a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceReadBPs?: Array<ThrottleDevice>;
  /**
   * Limit read rate (IO per second) from a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceReadIOPs?: Array<ThrottleDevice>;
  /**
   * Limit write rate (bytes per second) to a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceWriteBPs?: Array<ThrottleDevice>;
  /**
   * Limit write rate (IO per second) to a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceWriteIOPs?: Array<ThrottleDevice>;
};
