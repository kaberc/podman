/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefineThrottleDevice } from "./DefineThrottleDevice.ts";
import type { DefineWeightDevice } from "./DefineWeightDevice.ts";
export type UpdateContainerDevicesLimits = {
  /**
   * Block IO weight (relative device weight) in the form:
   * ```[{"Path": "device_path", "Weight": weight}]```
   */
  BlkIOWeightDevice?: Array<DefineWeightDevice>;
  /**
   * Limit read rate (bytes per second) from a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceReadBPs?: Array<DefineThrottleDevice>;
  /**
   * Limit read rate (IO per second) from a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceReadIOPs?: Array<DefineThrottleDevice>;
  /**
   * Limit write rate (bytes per second) to a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceWriteBPs?: Array<DefineThrottleDevice>;
  /**
   * Limit write rate (IO per second) to a device, in the form:
   * ```[{"Path": "device_path", "Rate": rate}]```
   */
  DeviceWriteIOPs?: Array<DefineThrottleDevice>;
};
