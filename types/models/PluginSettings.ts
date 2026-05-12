/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PluginDevice } from "./PluginDevice.ts";
import type { PluginMount } from "./PluginMount.ts";
export type PluginSettings = {
  /**
   * args
   */
  Args: Array<string>;
  /**
   * devices
   */
  Devices: Array<PluginDevice>;
  /**
   * env
   */
  Env: Array<string>;
  /**
   * mounts
   */
  Mounts: Array<PluginMount>;
};
