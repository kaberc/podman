/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * SubnetStatus subnet status
 */
export type SubnetStatus = {
  /**
   * Number of IP addresses within the network's IPRange for the subnet that are available for allocation, saturating at 2<sup>64</sup> - 1.
   */
  DynamicIPsAvailable?: number;
  /**
   * Number of IP addresses in the subnet that are in use or reserved and are therefore unavailable for allocation, saturating at 2<sup>64</sup> - 1.
   */
  IPsInUse?: number;
};
