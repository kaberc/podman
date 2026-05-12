/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IDMappingOptions } from "./IDMappingOptions.ts";
import type { ImageVolume } from "./ImageVolume.ts";
import type { LinuxResources } from "./LinuxResources.ts";
import type { Mount } from "./Mount.ts";
import type { NamedVolume } from "./NamedVolume.ts";
import type { Namespace } from "./Namespace.ts";
import type { OverlayVolume } from "./OverlayVolume.ts";
import type { PerNetworkOptions } from "./PerNetworkOptions.ts";
import type { PortMapping } from "./PortMapping.ts";
/**
 * PodSpecGenerator describes options to create a pod
 */
export type PodSpecGenerator = {
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
   * CgroupParent is the parent for the Cgroup that the pod will create.
   * This pod cgroup will, in turn, be the default cgroup parent for all
   * containers in the pod.
   * Optional.
   */
  cgroup_parent?: string;
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
   * ExitPolicy determines the pod's exit and stop behaviour.
   */
  exit_policy?: string;
  /**
   * HostAdd is a set of hosts that will be added to the infra container's
   * etc/hosts that will, by default, be shared with all containers in
   * the pod.
   * Conflicts with NoInfra=true and NoManageHosts.
   * Optional.
   */
  hostadd?: Array<string>;
  /**
   * Hostname is the pod's hostname. If not set, the name of the pod will
   * be used (if a name was not provided here, the name auto-generated for
   * the pod will be used). This will be used by the infra container and
   * all containers in the pod as long as the UTS namespace is shared.
   * Optional.
   */
  hostname?: string;
  /**
   * HostsFile is the base file to create the `/etc/hosts` file inside the infra container.
   * This must either be an absolute path to a file on the host system, or one of the
   * special flags `image` or `none`.
   * If it is empty it defaults to the base_hosts_file configuration in containers.conf.
   * Conflicts with NoInfra=true and NoManageHosts.
   * Optional.
   */
  hostsFile?: string;
  idmappings?: IDMappingOptions;
  /**
   * Image volumes bind-mount a container-image mount into the pod's infra container.
   * Optional.
   */
  image_volumes?: Array<ImageVolume>;
  /**
   * InfraCommand sets the command that will be used to start the infra
   * container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_command?: Array<string>;
  /**
   * InfraConmonPidFile is a custom path to store the infra container's
   * conmon PID.
   */
  infra_conmon_pid_file?: string;
  /**
   * InfraImage is the image that will be used for the infra container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_image?: string;
  /**
   * InfraName is the name that will be used for the infra container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_name?: string;
  ipcns?: Namespace;
  /**
   * Labels are key-value pairs that are used to add metadata to pods.
   * Optional.
   */
  labels?: Record<string, string>;
  /**
   * Mounts are mounts that will be added to the pod.
   * These will supersede Image Volumes and VolumesFrom volumes where
   * there are conflicts.
   * Optional.
   */
  mounts?: Array<Mount>;
  /**
   * Name is the name of the pod.
   * If not provided, a name will be generated when the pod is created.
   * Optional.
   */
  name?: string;
  netns?: Namespace;
  /**
   * NetworkOptions are additional options for each network
   * Optional.
   */
  network_options?: Record<string, Array<string>>;
  /**
   * NoInfra tells the pod not to create an infra container. If this is
   * done, many networking-related options will become unavailable.
   * Conflicts with setting unknown options in PodNetworkConfig, and the
   * InfraCommand and InfraImages in this struct.
   * Optional.
   */
  no_infra?: boolean;
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
   * Overlay volumes are named volumes that will be added to the pod.
   * Optional.
   */
  overlay_volumes?: Array<OverlayVolume>;
  pidns?: Namespace;
  pod_create_command?: Array<string>;
  /**
   * Devices contains user specified Devices to be added to the Pod
   */
  pod_devices?: Array<string>;
  /**
   * PortMappings is a set of ports to map into the infra container.
   * As, by default, containers share their network with the infra
   * container, this will forward the ports to the entire pod.
   * Only available if NetNS is set to Bridge or Pasta.
   * Optional.
   */
  portmappings?: Array<PortMapping>;
  resource_limits?: LinuxResources;
  /**
   * RestartPolicy is the pod's restart policy - an action which
   * will be taken when one or all the containers in the pod exits.
   * If not given, the default policy will be set to Always, which
   * restarts the containers in the pod when they exit indefinitely.
   * Optional.
   */
  restart_policy?: string;
  /**
   * RestartRetries is the number of attempts that will be made to restart
   * the container.
   * Only available when RestartPolicy is set to "on-failure".
   * Optional.
   */
  restart_tries?: number;
  security_opt?: Array<string>;
  /**
   * The ID of the pod's service container.
   */
  serviceContainerID?: string;
  /**
   * PodCreateCommand is the command used to create this pod.
   * This will be shown in the output of Inspect() on the pod, and may
   * also be used by some tools that wish to recreate the pod
   * (e.g. `podman generate systemd --new`).
   * Optional.
   * ShareParent determines if all containers in the pod will share the pod's cgroup as the cgroup parent
   */
  share_parent?: boolean;
  /**
   * SharedNamespaces instructs the pod to share a set of namespaces.
   * Shared namespaces will be joined (by default) by every container
   * which joins the pod.
   * If not set and NoInfra is false, the pod will set a default set of
   * namespaces to share.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  shared_namespaces?: Array<string>;
  /**
   * ShmSize is the size of the tmpfs to mount in at /dev/shm, in bytes.
   * Conflicts with ShmSize if IpcNS is not private.
   * Optional.
   */
  shm_size?: number;
  /**
   * ShmSizeSystemd is the size of systemd-specific tmpfs mounts
   * specifically /run, /run/lock, /var/log/journal and /tmp.
   * Optional
   */
  shm_size_systemd?: number;
  /**
   * Sysctl sets kernel parameters for the pod
   */
  sysctl?: Record<string, string>;
  userns?: Namespace;
  utsns?: Namespace;
  /**
   * Volumes are named volumes that will be added to the pod.
   * These will supersede Image Volumes and VolumesFrom  volumes where
   * there are conflicts.
   * Optional.
   */
  volumes?: Array<NamedVolume>;
  /**
   * VolumesFrom is a set of containers whose volumes will be added to
   * this pod. The name or ID of the container must be provided, and
   * may optionally be followed by a : and then one or more
   * comma-separated options. Valid options are 'ro', 'rw', and 'z'.
   * Options will be used for all volumes sourced from the container.
   */
  volumes_from?: Array<string>;
};
