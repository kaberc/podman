/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Namespace } from "./Namespace.ts";
import type { PerNetworkOptions } from "./PerNetworkOptions.ts";
import type { PortMapping } from "./PortMapping.ts";
/**
 * NetOptions reflect the shared network options between
 * pods and containers
 */
export type NetOptions = {
  dns_option?: Array<string>;
  dns_search?: Array<string>;
  dns_server?: Array<string>;
  hostadd?: Array<string>;
  hosts_file?: string;
  netns?: Namespace;
  network_alias?: Array<string>;
  /**
   * NetworkOptions are additional options for each network
   */
  network_options?: Record<string, Array<string>>;
  networks?: Record<string, PerNetworkOptions>;
  no_manage_hostname?: boolean;
  no_manage_hosts?: boolean;
  no_manage_resolv_conf?: boolean;
  portmappings?: Array<PortMapping>;
};
