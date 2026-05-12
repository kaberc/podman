/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InspectHostPort } from "./InspectHostPort.ts";
/**
 * InspectPodInfraConfig contains the configuration of the pod's infra
 * container.
 */
export type InspectPodInfraConfig = {
  /**
   * DNSOption is a set of DNS options that will be used by the infra
   * container's resolv.conf and shared with the remainder of the pod.
   */
  DNSOption?: Array<string>;
  /**
   * DNSSearch is a set of DNS search domains that will be used by the
   * infra container's resolv.conf and shared with the remainder of the
   * pod.
   */
  DNSSearch?: Array<string>;
  /**
   * DNSServer is a set of DNS Servers that will be used by the infra
   * container's resolv.conf and shared with the remainder of the pod.
   */
  DNSServer?: Array<string>;
  /**
   * HostAdd adds a number of hosts to the infra container's resolv.conf
   * which will be shared with the rest of the pod.
   */
  HostAdd?: Array<string>;
  /**
   * HostNetwork is whether the infra container (and thus the whole pod)
   * will use the host's network and not create a network namespace.
   */
  HostNetwork?: boolean;
  /**
   * HostsFile is the base file to create the `/etc/hosts` file inside the infra container
   * which will be shared with the rest of the pod.
   */
  HostsFile?: string;
  /**
   * NetworkOptions are additional options for each network
   */
  NetworkOptions?: Record<string, Array<string>>;
  /**
   * Networks is a list of networks the pod will join.
   */
  Networks?: Array<string>;
  /**
   * NoManageHostname indicates that the pod will not manage /etc/hostname
   * and instead each container will handle their own.
   */
  NoManageHostname?: boolean;
  /**
   * NoManageHosts indicates that the pod will not manage /etc/hosts and
   * instead each container will handle their own.
   */
  NoManageHosts?: boolean;
  /**
   * NoManageResolvConf indicates that the pod will not manage resolv.conf
   * and instead each container will handle their own.
   */
  NoManageResolvConf?: boolean;
  /**
   * PortBindings are ports that will be forwarded to the infra container
   * and then shared with the pod.
   */
  PortBindings?: Record<string, Array<InspectHostPort>>;
  /**
   * StaticIP is a static IPv4 that will be assigned to the infra
   * container and then used by the pod.
   */
  StaticIP?: string;
  /**
   * StaticMAC is a static MAC address that will be assigned to the infra
   * container and then used by the pod.
   */
  StaticMAC?: string;
  /**
   * CPUPeriod contains the CPU period of the pod
   */
  cpu_period?: number;
  /**
   * CPUQuota contains the CPU quota of the pod
   */
  cpu_quota?: number;
  /**
   * CPUSetCPUs contains linux specific CPU data for the container
   */
  cpuset_cpus?: string;
  /**
   * Pid is the PID namespace mode of the pod's infra container
   */
  pid_ns?: string;
  /**
   * UserNS is the usernamespace that all the containers in the pod will join.
   */
  userns?: string;
  /**
   * UtsNS is the uts namespace that all containers in the pod will join
   */
  uts_ns?: string;
};
