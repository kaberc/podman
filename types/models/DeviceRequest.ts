/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Used by GPU device drivers.
 */
export type DeviceRequest = {
  Capabilities?: Array<Array<string>>;
  Count?: number;
  DeviceIDs?: Array<string>;
  Driver?: string;
  Options?: Record<string, string>;
};
