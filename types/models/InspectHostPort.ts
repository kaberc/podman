/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectHostPort provides information on a port on the host that a container's
 * port is bound to.
 */
export type InspectHostPort = {
  /**
   * IP on the host we are bound to. "" if not specified (binding to all
   * IPs).
   */
  HostIp?: string;
  /**
   * Port on the host we are bound to. No special formatting - just an
   * integer stuffed into a string.
   */
  HostPort?: string;
};
