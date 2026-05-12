/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DNSNetworkInfo } from "./DNSNetworkInfo.ts";
import type { NetworkBackend } from "./NetworkBackend.ts";
export type NetworkInfo = {
  backend?: NetworkBackend;
  defaultNetwork?: string;
  dns?: DNSNetworkInfo;
  package?: string;
  path?: string;
  version?: string;
};
