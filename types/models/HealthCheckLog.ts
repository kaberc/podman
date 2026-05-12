/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * HealthCheckLog describes the results of a single healthcheck
 */
export type HealthCheckLog = {
  /**
   * End time as a string
   */
  End?: string;
  /**
   * Exitcode is 0 or 1
   */
  ExitCode?: number;
  /**
   * Output is the stdout/stderr from the healthcheck command
   */
  Output?: string;
  /**
   * Start time as string
   */
  Start?: string;
};
