/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheckLog } from "./HealthCheckLog.ts";
/**
 * HealthCheckResults describes the results/logs from a healthcheck
 */
export type HealthCheckResults = {
  /**
   * FailingStreak is the number of consecutive failed healthchecks
   */
  FailingStreak?: number;
  /**
   * Log describes healthcheck attempts and results
   */
  Log?: Array<HealthCheckLog>;
  /**
   * Status starting, healthy or unhealthy
   */
  Status?: string;
};
