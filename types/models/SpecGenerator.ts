/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtifactVolume } from "./ArtifactVolume.ts";
import type { HealthCheckOnFailureAction } from "./HealthCheckOnFailureAction.ts";
import type { IDMappingOptions } from "./IDMappingOptions.ts";
import type { ImageVolume } from "./ImageVolume.ts";
import type { LinuxDevice } from "./LinuxDevice.ts";
import type { LinuxDeviceCgroup } from "./LinuxDeviceCgroup.ts";
import type { LinuxIntelRdt } from "./LinuxIntelRdt.ts";
import type { LinuxPersonality } from "./LinuxPersonality.ts";
import type { LinuxResources } from "./LinuxResources.ts";
import type { LinuxThrottleDevice } from "./LinuxThrottleDevice.ts";
import type { LinuxWeightDevice } from "./LinuxWeightDevice.ts";
import type { LogConfigLibpod } from "./LogConfigLibpod.ts";
import type { Mount } from "./Mount.ts";
import type { NamedVolume } from "./NamedVolume.ts";
import type { Namespace } from "./Namespace.ts";
import type { OverlayVolume } from "./OverlayVolume.ts";
import type { PerNetworkOptions } from "./PerNetworkOptions.ts";
import type { PortMapping } from "./PortMapping.ts";
import type { POSIXRlimit } from "./POSIXRlimit.ts";
import type { Schema2HealthConfig } from "./Schema2HealthConfig.ts";
import type { Secret } from "./Secret.ts";
import type { Signal } from "./Signal.ts";
import type { StartupHealthCheck } from "./StartupHealthCheck.ts";
/**
 * SpecGenerator creates an OCI spec and Libpod configuration options to create
 * a container based on the given configuration.
 */
export type SpecGenerator = {
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
   * Annotations are key-value options passed into the container runtime
   * that can be used to trigger special behavior.
   * Optional.
   */
  annotations?: Record<string, string>;
  /**
   * ApparmorProfile is the name of the Apparmor profile the container
   * will use.
   * Optional.
   */
  apparmor_profile?: string;
  /**
   * ArtifactVolumes volumes based on an existing artifact.
   */
  artifact_volumes?: Array<ArtifactVolume>;
  /**
   * BaseHostsFile is the base file to create the `/etc/hosts` file inside the container.
   * This must either be an absolute path to a file on the host system, or one of the
   * special flags `image` or `none`.
   * If it is empty it defaults to the base_hosts_file configuration in containers.conf.
   * Optional.
   */
  base_hosts_file?: string;
  /**
   * CapAdd are capabilities which will be added to the container.
   * Conflicts with Privileged.
   * Optional.
   */
  cap_add?: Array<string>;
  /**
   * CapDrop are capabilities which will be removed from the container.
   * Conflicts with Privileged.
   * Optional.
   */
  cap_drop?: Array<string>;
  /**
   * CgroupParent is the container's Cgroup parent.
   * If not set, the default for the current cgroup driver will be used.
   * Optional.
   */
  cgroup_parent?: string;
  cgroupns?: Namespace;
  /**
   * CgroupsMode sets a policy for how cgroups will be created for the
   * container, including the ability to disable creation entirely.
   * Optional.
   */
  cgroups_mode?: string;
  /**
   * ChrootDirs is an additional set of directories that need to be
   * treated as root directories. Standard bind mounts will be mounted
   * into paths relative to these directories.
   * Optional.
   */
  chroot_directories?: Array<string>;
  /**
   * CNINetworks is a list of CNI networks to join the container to.
   * If this list is empty, the default CNI network will be joined
   * instead. If at least one entry is present, we will not join the
   * default network (unless it is part of this list).
   * Only available if NetNS is set to bridge.
   * Optional.
   * Deprecated: as of podman 4.0 use "Networks" instead.
   */
  cni_networks?: Array<string>;
  /**
   * Command is the container's command.
   * If not given and Image is specified, this will be populated by the
   * image's configuration.
   * Optional.
   */
  command?: Array<string>;
  /**
   * ConmonPidFile is a path at which a PID file for Conmon will be
   * placed.
   * If not given, a default location will be used.
   * Optional.
   */
  conmon_pid_file?: string;
  /**
   * ContainerCreateCommand is the command that was used to create this
   * container.
   * This will be shown in the output of Inspect() on the container, and
   * may also be used by some tools that wish to recreate the container
   * (e.g. `podman generate systemd --new`).
   * Optional.
   */
  containerCreateCommand?: Array<string>;
  /**
   * Create the working directory if it doesn't exist.
   * If unset, it doesn't create it.
   * Optional.
   */
  create_working_dir?: boolean;
  /**
   * DependencyContainers is an array of containers this container
   * depends on. Dependency containers must be started before this
   * container. Dependencies can be specified by name or full/partial ID.
   * Optional.
   */
  dependencyContainers?: Array<string>;
  /**
   * DeviceCgroupRule are device cgroup rules that allow containers
   * to use additional types of devices.
   */
  device_cgroup_rule?: Array<LinuxDeviceCgroup>;
  /**
   * Devices are devices that will be added to the container.
   * Optional.
   */
  devices?: Array<LinuxDevice>;
  /**
   * DevicesFrom specifies that this container will mount the device(s) from other container(s).
   * Optional.
   */
  devices_from?: Array<string>;
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
   * Entrypoint is the container's entrypoint.
   * If not given and Image is specified, this will be populated by the
   * image's configuration.
   * Optional.
   */
  entrypoint?: Array<string>;
  /**
   * Env is a set of environment variables that will be set in the
   * container.
   * Optional.
   */
  env?: Record<string, string>;
  /**
   * EnvHost indicates that the host environment should be added to container
   * Optional.
   */
  env_host?: boolean;
  /**
   * EnvMerge takes the specified environment variables from image and preprocess them before injecting them into the
   * container.
   * Optional.
   */
  envmerge?: Array<string>;
  /**
   * Expose is a number of ports that will be forwarded to the container
   * if PublishExposedPorts is set.
   * Expose is a map of uint16 (port number) to a string representing
   * protocol i.e map[uint16]string. Allowed protocols are "tcp", "udp", and "sctp", or some
   * combination of the three separated by commas.
   * If protocol is set to "" we will assume TCP.
   * Only available if NetNS is set to Bridge or Slirp, and
   * PublishExposedPorts is set.
   * Optional.
   */
  expose?: unknown;
  /**
   * GroupEntry specifies an arbitrary string to append to the container's /etc/group file.
   * Optional.
   */
  group_entry?: string;
  /**
   * Groups are a list of supplemental groups the container's user will
   * be granted access to.
   * Optional.
   */
  groups?: Array<string>;
  health_check_on_failure_action?: HealthCheckOnFailureAction;
  /**
   * HealthLogDestination defines the destination where the log is stored.
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthLogDestination?: string;
  /**
   * HealthMaxLogCount is maximum number of attempts in the HealthCheck log file.
   * ('0' value means an infinite number of attempts in the log file).
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthMaxLogCount?: number;
  /**
   * HealthMaxLogSize is the maximum length in characters of stored HealthCheck log
   * ("0" value means an infinite log length).
   * TODO (6.0): In next major release convert it to pointer and use omitempty
   */
  healthMaxLogSize?: number;
  healthconfig?: Schema2HealthConfig;
  /**
   * HostDeviceList is used to recreate the mounted device on inherited containers
   */
  host_device_list?: Array<LinuxDevice>;
  /**
   * HostAdd is a set of hosts which will be added to the container's
   * etc/hosts file.
   * Conflicts with UseImageHosts.
   * Optional.
   */
  hostadd?: Array<string>;
  /**
   * Hostname is the container's hostname. If not set, the hostname will
   * not be modified (if UtsNS is not private) or will be set to the
   * container ID (if UtsNS is private).
   * Conflicts with UtsNS if UtsNS is not set to private.
   * Optional.
   */
  hostname?: string;
  /**
   * HostUsers is a list of host usernames or UIDs to add to the container
   * etc/passwd file
   */
  hostusers?: Array<string>;
  /**
   * EnvHTTPProxy indicates that the http host proxy environment variables
   * should be added to container
   * Optional.
   */
  httpproxy?: boolean;
  idmappings?: IDMappingOptions;
  /**
   * Image is the image the container will be based on. The image will be
   * used as the container's root filesystem, and its environment vars,
   * volumes, and other configuration will be applied to the container.
   * Conflicts with Rootfs.
   * At least one of Image or Rootfs must be specified.
   */
  image?: string;
  /**
   * ImageArch is the user-specified image architecture.
   * Used to select a different variant from a manifest list.
   * Optional.
   */
  image_arch?: string;
  /**
   * ImageOS is the user-specified OS of the image.
   * Used to select a different variant from a manifest list.
   * Optional.
   */
  image_os?: string;
  /**
   * ImageVariant is the user-specified image variant.
   * Used to select a different variant from a manifest list.
   * Optional.
   */
  image_variant?: string;
  /**
   * ImageVolumeMode indicates how image volumes will be created.
   * Supported modes are "ignore" (do not create), "tmpfs" (create as
   * tmpfs), and "anonymous" (create as anonymous volumes).
   * The default if unset is anonymous.
   * Optional.
   */
  image_volume_mode?: string;
  /**
   * Image volumes bind-mount a container-image mount into the container.
   * Optional.
   */
  image_volumes?: Array<ImageVolume>;
  /**
   * Init specifies that an init binary will be mounted into the
   * container, and will be used as PID1.
   * Optional.
   */
  init?: boolean;
  /**
   * InitContainerType describes if this container is an init container
   * and if so, what type: always or once.
   * Optional.
   */
  init_container_type?: string;
  /**
   * InitPath specifies the path to the init binary that will be added if
   * Init is specified above. If not specified, the default set in the
   * Libpod config will be used. Ignored if Init above is not set.
   * Optional.
   */
  init_path?: string;
  intelRdt?: LinuxIntelRdt;
  ipcns?: Namespace;
  /**
   * LabelNested indicates whether or not the container is allowed to
   * run fully nested containers including SELinux labelling.
   * Optional.
   */
  label_nested?: boolean;
  /**
   * Labels are key-value pairs that are used to add metadata to
   * containers.
   * Optional.
   */
  labels?: Record<string, string>;
  log_configuration?: LogConfigLibpod;
  /**
   * Passwd is a container run option that determines if we are validating users/groups before running the container
   */
  manage_password?: boolean;
  /**
   * Mask is the path we want to mask in the container. This masks the paths
   * given in addition to the default list.
   * Optional
   */
  mask?: Array<string>;
  /**
   * Mounts are mounts that will be added to the container.
   * These will supersede Image Volumes and VolumesFrom volumes where
   * there are conflicts.
   * Optional.
   */
  mounts?: Array<Mount>;
  /**
   * Name is the name the container will be given.
   * If no name is provided, one will be randomly generated.
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
   * NoNewPrivileges is whether the container will set the no new
   * privileges flag on create, which disables gaining additional
   * privileges (e.g. via setuid) in the container.
   * Optional.
   */
  no_new_privileges?: boolean;
  /**
   * OCIRuntime is the name of the OCI runtime that will be used to create
   * the container.
   * If not specified, the default will be used.
   * Optional.
   */
  oci_runtime?: string;
  /**
   * OOMScoreAdj adjusts the score used by the OOM killer to determine
   * processes to kill for the container's process.
   * Optional.
   */
  oom_score_adj?: number;
  /**
   * Overlay volumes are named volumes that will be added to the container.
   * Optional.
   */
  overlay_volumes?: Array<OverlayVolume>;
  /**
   * PasswdEntry specifies an arbitrary string to append to the container's /etc/passwd file.
   * Optional.
   */
  passwd_entry?: string;
  personality?: LinuxPersonality;
  pidns?: Namespace;
  /**
   * Pod is the ID of the pod the container will join.
   * Optional.
   */
  pod?: string;
  /**
   * PortBindings is a set of ports to map into the container.
   * Only available if NetNS is set to bridge, slirp, or pasta.
   * Optional.
   */
  portmappings?: Array<PortMapping>;
  /**
   * Privileged is whether the container is privileged.
   * Privileged does the following:
   * Adds all devices on the system to the container.
   * Adds all capabilities to the container.
   * Disables Seccomp, SELinux, and Apparmor confinement.
   * (Though SELinux can be manually re-enabled).
   * TODO: this conflicts with things.
   * TODO: this does more.
   * Optional.
   */
  privileged?: boolean;
  /**
   * ProcOpts are the options used for the proc mount.
   */
  procfs_opts?: Array<string>;
  /**
   * PublishExposedPorts will publish ports specified in the image to
   * random unused ports (guaranteed to be above 1024) on the host.
   * This is based on ports set in Expose below, and unknown ports specified
   * by the Image (if one is given).
   * Only available if NetNS is set to Bridge or Slirp.
   * Optional.
   */
  publish_image_ports?: boolean;
  /**
   * Rlimits are POSIX rlimits to apply to the container.
   * Optional.
   */
  r_limits?: Array<POSIXRlimit>;
  /**
   * RawImageName is the user-specified and unprocessed input referring
   * to a local or a remote image.
   * Optional, but strongly encouraged to be set if Image is set.
   */
  raw_image_name?: string;
  /**
   * ReadOnlyFilesystem indicates that everything will be mounted
   * as read-only.
   * Optional.
   */
  read_only_filesystem?: boolean;
  /**
   * ReadWriteTmpfs indicates that when running with a ReadOnlyFilesystem
   * mount temporary file systems.
   * Optional.
   */
  read_write_tmpfs?: boolean;
  /**
   * Remove indicates if the container should be removed once it has been started
   * and exits.
   * Optional.
   */
  remove?: boolean;
  /**
   * RemoveImage indicates that the container should remove the image it
   * was created from after it exits.
   * Only allowed if Remove is set to true and Image, not Rootfs, is in
   * use.
   * Optional.
   */
  removeImage?: boolean;
  resource_limits?: LinuxResources;
  /**
   * RestartPolicy is the container's restart policy - an action which
   * will be taken when the container exits.
   * If not given, the default policy, which does nothing, will be used.
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
  /**
   * Rootfs is the path to a directory that will be used as the
   * container's root filesystem. No modification will be made to the
   * directory, it will be directly mounted into the container as root.
   * Conflicts with Image.
   * At least one of Image or Rootfs must be specified.
   */
  rootfs?: string;
  /**
   * RootfsMapping specifies if there are UID/GID mappings to apply to the rootfs.
   * Optional.
   */
  rootfs_mapping?: string;
  /**
   * RootfsOverlay tells if rootfs is actually an overlay on top of base path.
   * Optional.
   */
  rootfs_overlay?: boolean;
  /**
   * RootfsPropagation is the rootfs propagation mode for the container.
   * If not set, the default of rslave will be used.
   * Optional.
   */
  rootfs_propagation?: string;
  /**
   * Determine how to handle the NOTIFY_SOCKET - do we participate or pass it through
   * "container" - let the OCI runtime deal with it, advertise conmon's MAINPID
   * "conmon-only" - advertise conmon's MAINPID, send READY when started, don't pass to OCI
   * "ignore" - unset NOTIFY_SOCKET
   * Optional.
   */
  sdnotifyMode?: string;
  /**
   * SeccompPolicy determines which seccomp profile gets applied
   * the container. valid values: empty,default,image
   */
  seccomp_policy?: string;
  /**
   * SeccompProfilePath is the path to a JSON file containing the
   * container's Seccomp profile.
   * If not specified, no Seccomp profile will be used.
   * Optional.
   */
  seccomp_profile_path?: string;
  /**
   * EnvSecrets are secrets that will be set as environment variables
   * Optional.
   */
  secret_env?: Record<string, string>;
  /**
   * Secrets are the secrets that will be added to the container
   * Optional.
   */
  secrets?: Array<Secret>;
  /**
   * SelinuxProcessLabel is the process label the container will use.
   * If SELinux is enabled and this is not specified, a label will be
   * automatically generated if not specified.
   * Optional.
   */
  selinux_opts?: Array<string>;
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
  startupHealthConfig?: StartupHealthCheck;
  /**
   * Stdin is whether the container will keep its STDIN open.
   * Optional.
   */
  stdin?: boolean;
  stop_signal?: Signal;
  /**
   * StopTimeout is a timeout between the container's stop signal being
   * sent and SIGKILL being sent.
   * If not provided, the default will be used.
   * If 0 is used, stop signal will not be sent, and SIGKILL will be sent
   * instead.
   * Optional.
   */
  stop_timeout?: number;
  /**
   * StorageOpts is the container's storage options
   * Optional.
   */
  storage_opts?: Record<string, string>;
  /**
   * Sysctl sets kernel parameters for the container
   */
  sysctl?: Record<string, string>;
  /**
   * Systemd is whether the container will be started in systemd mode.
   * Valid options are "true", "false", and "always".
   * "true" enables this mode only if the binary run in the container is
   * sbin/init or systemd. "always" unconditionally enables systemd mode.
   * "false" unconditionally disables systemd mode.
   * If enabled, mounts and stop signal will be modified.
   * If set to "always" or set to "true" and conditionally triggered,
   * conflicts with StopSignal.
   * If not specified, "false" will be assumed.
   * Optional.
   */
  systemd?: string;
  /**
   * Terminal is whether the container will create a PTY.
   * Optional.
   */
  terminal?: boolean;
  /**
   * IO read rate limit per cgroup per device, bytes per second
   */
  throttleReadBpsDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO read rate limit per cgroup per device, IO per second
   */
  throttleReadIOPSDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, bytes per second
   */
  throttleWriteBpsDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * IO write rate limit per cgroup per device, IO per second
   */
  throttleWriteIOPSDevice?: Record<string, LinuxThrottleDevice>;
  /**
   * Timeout is a maximum time in seconds the container will run before
   * main process is sent SIGKILL.
   * If 0 is used, signal will not be sent. Container can run indefinitely
   * if they do not stop after the default termination signal.
   * Optional.
   */
  timeout?: number;
  /**
   * Timezone is the timezone inside the container.
   * Local means it has the same timezone as the host machine
   * Optional.
   */
  timezone?: string;
  /**
   * Umask is the umask the init process of the container will be run with.
   */
  umask?: string;
  /**
   * CgroupConf are key-value options passed into the container runtime
   * that are used to configure cgroup v2.
   * Optional.
   */
  unified?: Record<string, string>;
  /**
   * Unmask a path in the container. Some paths are masked by default,
   * preventing them from being accessed within the container; this undoes
   * that masking. If ALL is passed, all paths will be unmasked.
   * Optional.
   */
  unmask?: Array<string>;
  /**
   * UnsetEnv unsets the specified default environment variables from the image or from built-in or containers.conf
   * Optional.
   */
  unsetenv?: Array<string>;
  /**
   * UnsetEnvAll unsetall default environment variables from the image or from built-in or containers.conf
   * UnsetEnvAll unsets all default environment variables from the image or from built-in
   * Optional.
   */
  unsetenvall?: boolean;
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
  /**
   * User is the user the container will be run as.
   * Can be given as a UID or a username; if a username, it will be
   * resolved within the container, using the container's /etc/passwd.
   * If unset, the container will be run as root.
   * Optional.
   */
  user?: string;
  userns?: Namespace;
  utsns?: Namespace;
  /**
   * Volatile specifies whether the container storage can be optimized
   * at the cost of not syncing all the dirty files in memory.
   * Optional.
   */
  volatile?: boolean;
  /**
   * Volumes are named volumes that will be added to the container.
   * These will supersede Image Volumes and VolumesFrom volumes where
   * there are conflicts.
   * Optional.
   */
  volumes?: Array<NamedVolume>;
  /**
   * VolumesFrom is a set of containers whose volumes will be added to
   * this container. The name or ID of the container must be provided, and
   * may optionally be followed by a : and then one or more
   * comma-separated options. Valid options are 'ro', 'rw', and 'z'.
   * Options will be used for all volumes sourced from the container.
   * Optional.
   */
  volumes_from?: Array<string>;
  /**
   * Weight per cgroup per device, can override BlkioWeight
   */
  weightDevice?: Record<string, LinuxWeightDevice>;
  /**
   * WorkDir is the container's working directory.
   * If unset, the default, /, will be used.
   * Optional.
   */
  work_dir?: string;
};
