/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Namespace } from "./Namespace.ts";
import type { PerNetworkOptions } from "./PerNetworkOptions.ts";
import type { PortMapping } from "./PortMapping.ts";
export type PodNetworkConfig = {
  /**
   * Map of networks names to ids the container should join to.
   * You can request additional settings for each network, you can
   * set network aliases, static ips, static mac address  and the
   * network interface name for this container on the specific network.
   * If the map is empty and the bridge network mode is set the container
   * will be joined to the default network.
   */
  Networks?: Record<string, PerNetworkOptions>;
  /**
   * DNSOption is a set of DNS options that will be used in the infra
   * container's resolv.conf, which will, by default, be shared with all
   * containers in the pod.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  dns_option?: Array<string>;
  /**
   * DNSSearch is a set of DNS search domains that will be used in the
   * infra container's resolv.conf, which will, by default, be shared with
   * all containers in the pod.
   * If not provided, DNS search domains from the host's resolv.conf will
   * be used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  dns_search?: Array<string>;
  /**
   * DNSServer is a set of DNS servers that will be used in the infra
   * container's resolv.conf, which will, by default, be shared with all
   * containers in the pod.
   * If not provided, the host's DNS servers will be used, unless the only
   * server set is a localhost address. As the container cannot connect to
   * the host's localhost, a default server will instead be set.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  dns_server?: Array<string>;
  /**
   * HostAdd is a set of hosts that will be added to the infra container's
   * etc/hosts that will, by default, be shared with all containers in
   * the pod.
   * Conflicts with NoInfra=true and NoManageHosts.
   * Optional.
   */
  hostadd?: Array<string>;
  /**
   * HostsFile is the base file to create the `/etc/hosts` file inside the infra container.
   * This must either be an absolute path to a file on the host system, or one of the
   * special flags `image` or `none`.
   * If it is empty it defaults to the base_hosts_file configuration in containers.conf.
   * Conflicts with NoInfra=true and NoManageHosts.
   * Optional.
   */
  hostsFile?: string;
  netns?: Namespace;
  /**
   * NetworkOptions are additional options for each network
   * Optional.
   */
  network_options?: Record<string, Array<string>>;
  /**
   * NoManageHostname indicates that /etc/hostname should not be managed
   * by the pod. Instead, each container will create a separate
   * etc/hostname as they would if not in a pod.
   */
  no_manage_hostname?: boolean;
  /**
   * NoManageHosts indicates that /etc/hosts should not be managed by the
   * pod. Instead, each container will create a separate /etc/hosts as
   * they would if not in a pod.
   * Conflicts with HostAdd.
   */
  no_manage_hosts?: boolean;
  /**
   * NoManageResolvConf indicates that /etc/resolv.conf should not be
   * managed by the pod. Instead, each container will create and manage a
   * separate resolv.conf as if they had not joined a pod.
   * Conflicts with NoInfra=true and DNSServer, DNSSearch, DNSOption.
   * Optional.
   */
  no_manage_resolv_conf?: boolean;
  /**
   * PortMappings is a set of ports to map into the infra container.
   * As, by default, containers share their network with the infra
   * container, this will forward the ports to the entire pod.
   * Only available if NetNS is set to Bridge or Pasta.
   * Optional.
   */
  portmappings?: Array<PortMapping>;
};
