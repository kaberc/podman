/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectLogConfig holds information about a container's configured log driver
 */
export type InspectLogConfig = {
  Config?: Record<string, string>;
  /**
   * Path specifies a path to the log file
   */
  Path?: string;
  /**
   * Size specifies a maximum size of the container log
   */
  Size?: string;
  /**
   * Tag specifies a custom log tag for the container
   */
  Tag?: string;
  Type?: string;
};
