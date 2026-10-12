/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RouteType } from "./RouteType.ts";
export type Route = {
  /**
   * Destination for this route in CIDR form.
   */
  destination?: string;
  /**
   * Gateway IP for this route. Required for unicast routes, must be empty for blackhole/unreachable/prohibit.
   */
  gateway?: string;
  /**
   * Metric for this route. Optional.
   */
  metric?: number;
  route_type?: RouteType;
};
