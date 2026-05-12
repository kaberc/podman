/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxInterfacePriority } from "./LinuxInterfacePriority.ts";
/**
 * LinuxNetwork identification and priority configuration
 */
export type LinuxNetwork = {
  /**
   * Set class identifier for container's network packets
   */
  classID?: number;
  /**
   * Set priority of network traffic for container
   */
  priorities?: Array<LinuxInterfacePriority>;
};
