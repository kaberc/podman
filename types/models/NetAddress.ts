/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IPNet } from "./IPNet.ts";
export type NetAddress = {
  /**
   * Gateway for the network. This can be empty if there is no gateway, e.g. internal network.
   */
  gateway?: string;
  ipnet?: IPNet;
};
