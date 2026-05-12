/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PortMapping = {
  /**
   * ContainerPort is the port number that will be exposed from the
   * container.
   * Mandatory.
   */
  container_port?: number;
  /**
   * HostIP is the IP that we will bind to on the host.
   * If unset, assumed to be 0.0.0.0 (all interfaces).
   */
  host_ip?: string;
  /**
   * HostPort is the port number that will be forwarded from the host into
   * the container.
   * If omitted, a random port on the host (guaranteed to be over 1024)
   * will be assigned.
   */
  host_port?: number;
  /**
   * Protocol is the protocol forward.
   * Must be either "tcp", "udp", and "sctp", or some combination of these
   * separated by commas.
   * If unset, assumed to be TCP.
   */
  protocol?: string;
  /**
   * Range is the number of ports that will be forwarded, starting at
   * HostPort and ContainerPort and counting up.
   * This is 1-indexed, so 1 is assumed to be a single port (only the
   * Hostport:Containerport mapping will be added), 2 is two ports (both
   * Hostport:Containerport and Hostport+1:Containerport+1), etc.
   * If unset, assumed to be 1 (a single port).
   * Both hostport + range and containerport + range must be less than
   * 65536.
   */
  range?: number;
};
