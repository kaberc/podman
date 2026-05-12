/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * QuadletRemoveReport contains the results of an operation to remove obe or more quadlets
 */
export type QuadletRemoveReport = {
  /**
   * Errors is a map of Quadlet name to error that occurred during removal.
   */
  Errors?: Record<string, string>;
  /**
   * Removed is a list of quadlets that were successfully removed
   */
  Removed?: Array<string>;
};
