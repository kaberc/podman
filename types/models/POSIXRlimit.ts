/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * POSIXRlimit type and restrictions
 */
export type POSIXRlimit = {
  /**
   * Hard is the hard limit for the specified type
   */
  hard?: number;
  /**
   * Soft is the soft limit for the specified type
   */
  soft?: number;
  /**
   * Type of the rlimit to set
   */
  type?: string;
};
