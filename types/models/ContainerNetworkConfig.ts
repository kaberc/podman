/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Namespace } from "./Namespace.ts";
import type { PerNetworkOptions } from "./PerNetworkOptions.ts";
import type { PortMapping } from "./PortMapping.ts";
/**
 * ContainerNetworkConfig contains information on a container's network
 * configuration.
 */
export type ContainerNetworkConfig = {
  /**
   * Map of networks names or ids that the container should join.
   * You can request additional settings for each network, you can
   * set network aliases, static ips, static mac address  and the
   * network interface name for this container on the specific network.
   * If the map is empty and the bridge network mode is set the container
   * will be joined to the default network.
   * Optional.
   */
  Networks?: Record<string, PerNetworkOptions>;
  /**
   * BaseHostsFile is the base file to create the `/etc/hosts` file inside the container.
   * This must either be an absolute path to a file on the host system, or one of the
   * special flags `image` or `none`.
   * If it is empty it defaults to the base_hosts_file configuration in containers.conf.
   * Optional.
   */
  base_hosts_file?: string;
  /**
   * DNSOptions is a set of DNS options that will be used in the
   * container's resolv.conf, replacing the host's DNS options which are
   * used by default.
   * Conflicts with UseImageResolvConf.
   * Optional.
   */
  dns_option?: Array<string>;
  /**
   * DNSSearch is a set of DNS search domains that will be used in the
   * container's resolv.conf, replacing the host's DNS search domains
   * which are used by default.
   * Conflicts with UseImageResolvConf.
   * Optional.
   */
  dns_search?: Array<string>;
  /**
   * DNSServers is a set of DNS servers that will be used in the
   * container's resolv.conf, replacing the host's DNS Servers which are
   * used by default.
   * Conflicts with UseImageResolvConf.
   * Optional.
   */
  dns_server?: Array<string>;
  /**
   * Expose is a number of ports that will be forwarded to the container
   * if PublishExposedPorts is set.
   * Expose is a map of uint16 (port number) to a string representing
   * protocol i.e map[uint16]string. Allowed protocols are "tcp", "udp", and "sctp", or some
   * combination of the three separated by commas.
   * If protocol is set to "" we will assume TCP.
   * Only available if NetNS is set to Bridge or Pasta, and
   * PublishExposedPorts is set.
   * Optional.
   */
  expose?: unknown;
  /**
   * HostAdd is a set of hosts which will be added to the container's
   * etc/hosts file.
   * Conflicts with UseImageHosts.
   * Optional.
   */
  hostadd?: Array<string>;
  netns?: Namespace;
  /**
   * NetworkOptions are additional options for each network
   * Optional.
   */
  network_options?: Record<string, Array<string>>;
  /**
   * The order that networks will be configured in.
   * If not set, alphabetical order based on network name will be used.
   * If set: Must be the same length as Networks and its contents must be every key in the Networks map.
   * Optional.
   */
  networkOrder?: Array<string>;
  /**
   * PortBindings is a set of ports to map into the container.
   * Only available if NetNS is set to bridge or pasta.
   * Optional.
   */
  portmappings?: Array<PortMapping>;
  /**
   * PublishExposedPorts will publish ports specified in the image to
   * random unused ports (guaranteed to be above 1024) on the host.
   * This is based on ports set in Expose below, and unknown ports specified
   * by the Image (if one is given).
   * Only available if NetNS is set to Bridge or Pasta.
   * Optional.
   */
  publish_image_ports?: boolean;
  /**
   * UseImageHostname indicates that /etc/hostname should not be managed by
   * Podman, and instead sourced from the image.
   * Optional.
   */
  use_image_hostname?: boolean;
  /**
   * UseImageHosts indicates that /etc/hosts should not be managed by
   * Podman, and instead sourced from the image.
   * Conflicts with HostAdd.
   * Optional.
   */
  use_image_hosts?: boolean;
  /**
   * UseImageResolvConf indicates that resolv.conf should not be managed
   * by Podman, but instead sourced from the image.
   * Conflicts with DNSServer, DNSSearch, DNSOption.
   * Optional.
   */
  use_image_resolve_conf?: boolean;
};
