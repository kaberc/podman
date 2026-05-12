/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerNetworkOptions = {
  /**
   * Aliases contains a list of names which the dns server should resolve
   * to this container. Should only be set when DNSEnabled is true on the Network.
   * If aliases are set but there is no dns support for this network the
   * network interface implementation should ignore this and NOT error.
   * Optional.
   */
  aliases?: Array<string>;
  /**
   * InterfaceName for this container. Required in the backend.
   * Optional in the frontend. Will be filled with ethX (where X is a integer) when empty.
   */
  interface_name?: string;
  /**
   * Driver-specific options for this container.
   */
  options?: Record<string, string>;
  /**
   * StaticIPs for this container. Optional.
   */
  static_ips?: Array<string>;
  /**
   * StaticMac for this container. Optional.
   */
  static_mac?: string;
};
