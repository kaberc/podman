/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IPAMConfig } from "./IPAMConfig.ts";
/**
 * IPAM represents IP Address Management
 */
export type IPAM = {
  Config?: Array<IPAMConfig>;
  Driver?: string;
  Options?: Record<string, string>;
};
