/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaseRange } from "./LeaseRange.ts";
export type Subnet = {
  /**
   * Gateway IP for this Network.
   */
  gateway?: string;
  lease_range?: LeaseRange;
  /**
   * Subnet for this Network in CIDR form.
   */
  subnet?: string;
};
