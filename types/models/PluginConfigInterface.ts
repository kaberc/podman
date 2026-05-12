/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PluginInterfaceType } from "./PluginInterfaceType.ts";
/**
 * PluginConfigInterface The interface between Docker and the plugin
 */
export type PluginConfigInterface = {
  /**
   * Protocol to use for clients connecting to the plugin.
   */
  ProtocolScheme?: string;
  /**
   * socket
   */
  Socket: string;
  /**
   * types
   */
  Types: Array<PluginInterfaceType>;
};
