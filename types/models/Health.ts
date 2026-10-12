/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthcheckResult } from "./HealthcheckResult.ts";
import type { HealthStatus } from "./HealthStatus.ts";
/**
 * Health stores information about the container's healthcheck results
 */
export type Health = {
  FailingStreak?: number;
  Log?: Array<HealthcheckResult>;
  Status?: HealthStatus;
};
