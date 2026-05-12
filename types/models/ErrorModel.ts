/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * ErrorModel is used in remote connections with podman
 */
export type ErrorModel = {
  /**
   * API root cause formatted for automated parsing
   */
  cause?: string;
  /**
   * human error message, formatted for a human to read
   */
  message?: string;
  /**
   * HTTP response code
   */
  response?: number;
};
