/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PodStatsReport = {
  /**
   * Humanized disk usage read + write
   */
  BlockIO?: string;
  /**
   * Container ID
   */
  CID?: string;
  /**
   * Percentage of CPU utilized by pod
   */
  CPU?: string;
  /**
   * Percentage of Memory utilized by pod
   */
  Mem?: string;
  /**
   * Humanized Memory usage and maximum
   */
  MemUsage?: string;
  /**
   * Memory usage and maximum in bytes
   */
  MemUsageBytes?: string;
  /**
   * Pod Name
   */
  Name?: string;
  /**
   * Network usage inbound + outbound
   */
  NetIO?: string;
  /**
   * Container PID
   */
  PIDS?: string;
  /**
   * Pod ID
   */
  Pod?: string;
};
