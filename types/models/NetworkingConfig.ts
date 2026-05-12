/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointSettings } from "./EndpointSettings.ts";
/**
 * NetworkingConfig represents the container's networking configuration for each of its interfaces
 * Carries the networking configs specified in the `docker run` and `docker network connect` commands
 */
export type NetworkingConfig = {
  EndpointsConfig?: Record<string, EndpointSettings>;
};
