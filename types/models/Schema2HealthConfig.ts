/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Duration } from "./Duration.ts";
/**
 * Schema2HealthConfig is a HealthConfig, which holds configuration settings
 * for the HEALTHCHECK feature, from docker/docker/api/types/container.
 */
export type Schema2HealthConfig = {
  Interval?: Duration;
  /**
   * Retries is the number of consecutive failures needed to consider a container as unhealthy.
   * Zero means inherit.
   */
  Retries?: number;
  StartInterval?: Duration;
  StartPeriod?: Duration;
  /**
   * Test is the test to perform to check that the container is healthy.
   * An empty slice means to inherit the default.
   * The options are:
   * {} : inherit healthcheck
   * {"NONE"} : disable healthcheck
   * {"CMD", args...} : exec arguments directly
   * {"CMD-SHELL", command} : run command with system's default shell
   */
  Test?: Array<string>;
  Timeout?: Duration;
};
