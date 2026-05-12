/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NetInterface } from "./NetInterface.ts";
export type NetworkContainerInfo = {
  /**
   * Interfaces configured for this container with their addresses
   */
  interfaces?: Record<string, NetInterface>;
  /**
   * Name of the container
   */
  name?: string;
};
