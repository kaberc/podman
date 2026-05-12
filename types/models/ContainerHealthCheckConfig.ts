/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheckOnFailureAction } from "./HealthCheckOnFailureAction.ts";
import type { Schema2HealthConfig } from "./Schema2HealthConfig.ts";
import type { StartupHealthCheck } from "./StartupHealthCheck.ts";
/**
 * ContainerHealthCheckConfig describes a container healthcheck with attributes
 * like command, retries, interval, start period, and timeout.
 */
export type ContainerHealthCheckConfig = {
  health_check_on_failure_action?: HealthCheckOnFailureAction;
  /**
   * HealthLogDestination defines the destination where the log is stored.
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthLogDestination?: string;
  /**
   * HealthMaxLogCount is maximum number of attempts in the HealthCheck log file.
   * ('0' value means an infinite number of attempts in the log file).
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthMaxLogCount?: number;
  /**
   * HealthMaxLogSize is the maximum length in characters of stored HealthCheck log
   * ("0" value means an infinite log length).
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthMaxLogSize?: number;
  healthconfig?: Schema2HealthConfig;
  startupHealthConfig?: StartupHealthCheck;
};
