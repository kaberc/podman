/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LogConfig describes the logging characteristics for a container
 */
export type LogConfigLibpod = {
  /**
   * LogDriver is the container's log driver.
   * Optional.
   */
  driver?: string;
  /**
   * A set of log labels to apply
   * Only available if LogDriver is set to "journald".
   * Optional
   */
  labels?: Record<string, string>;
  /**
   * A set of options to accompany the log driver.
   * Optional.
   */
  options?: Record<string, string>;
  /**
   * LogPath is the path the container's logs will be stored at.
   * Only available if LogDriver is set to "json-file" or "k8s-file".
   * Optional.
   */
  path?: string;
  /**
   * Size is the maximum size of the log file
   * Optional.
   */
  size?: number;
};
