/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WaitExitError } from "./WaitExitError.ts";
/**
 * OK response to ContainerWait operation
 */
export type WaitResponse = {
  Error?: WaitExitError;
  /**
   * Exit code of the container
   */
  StatusCode: number;
};
