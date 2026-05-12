/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PortSummary = {
  /**
   * Host IP address that the container's port is mapped to
   */
  IP?: string;
  /**
   * Port on the container
   */
  PrivatePort: number;
  /**
   * Port exposed on the host
   */
  PublicPort?: number;
  /**
   * type
   */
  Type: "tcp" | "udp" | "sctp";
};
