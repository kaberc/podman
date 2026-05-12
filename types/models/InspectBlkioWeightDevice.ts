/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectBlkioWeightDevice holds information about the relative weight
 * of an individual device node. Weights are used in the I/O scheduler to give
 * relative priority to some accesses.
 */
export type InspectBlkioWeightDevice = {
  /**
   * Path is the path to the device this applies to.
   */
  Path?: string;
  /**
   * Weight is the relative weight the scheduler will use when scheduling
   * I/O.
   */
  Weight?: number;
};
