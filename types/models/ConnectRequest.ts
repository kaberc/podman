/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointSettings } from "./EndpointSettings.ts";
export type ConnectRequest = {
  /**
   * The ID or name of the container to connect to the network.
   */
  Container: string;
  EndpointConfig?: EndpointSettings;
};
