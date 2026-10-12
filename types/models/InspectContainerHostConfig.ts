/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InspectBlkioThrottleDevice } from "./InspectBlkioThrottleDevice.ts";
import type { InspectBlkioWeightDevice } from "./InspectBlkioWeightDevice.ts";
import type { InspectDevice } from "./InspectDevice.ts";
import type { InspectHostPort } from "./InspectHostPort.ts";
import type { InspectIDMappings } from "./InspectIDMappings.ts";
import type { InspectLogConfig } from "./InspectLogConfig.ts";
import type { InspectRestartPolicy } from "./InspectRestartPolicy.ts";
import type { InspectUlimit } from "./InspectUlimit.ts";
/**
 * InspectContainerHostConfig holds information used when the container was
 * created.
 * It's very much a Docker-specific struct, retained (mostly) as-is for
 * compatibility. We fill individual fields as best as we can, inferring as much
 * as possible from the spec and container config.
 * Some things cannot be inferred. These will be populated by spec annotations
 * (if available).
 */
export type InspectContainerHostConfig = {
  /**
   * Annotations are provided to the runtime when the container is
   * started.
   */
  Annotations?: Record<string, string>;
  /**
   * AutoRemove is whether the container will be automatically removed on
   * exiting.
   * It is not handled directly within libpod and is stored in an
   * annotation.
   */
  AutoRemove?: boolean;
  /**
   * AutoRemoveImage is whether the container's image will be
   * automatically removed on exiting.
   * It is not handled directly within libpod and is stored in an
   * annotation.
   */
  AutoRemoveImage?: boolean;
  /**
   * Binds contains an array of user-added mounts.
   * Both volume mounts and named volumes are included.
   * Tmpfs mounts are NOT included.
   * In 'docker inspect' this is separated into 'Binds' and 'Mounts' based
   * on how a mount was added. We do not make this distinction and do not
   * include a Mounts field in inspect.
   * Format: <src>:<destination>[:<comma-separated options>]
   */
  Binds?: Array<string>;
  /**
   * BlkioDeviceReadBps is an array of I/O throttle parameters for
   * individual device nodes.
   * This specifically sets read rate cap in bytes per second for device
   * nodes.
   * As with BlkioWeightDevice, we pull the path from /sys/dev, and we
   * don't guarantee the path will be identical to the original (though
   * the node will be).
   */
  BlkioDeviceReadBps?: Array<InspectBlkioThrottleDevice>;
  /**
   * BlkioDeviceReadIOps is an array of I/O throttle parameters for
   * individual device nodes.
   * This specifically sets the read rate cap in iops per second for
   * device nodes.
   * As with BlkioWeightDevice, we pull the path from /sys/dev, and we
   * don't guarantee the path will be identical to the original (though
   * the node will be).
   */
  BlkioDeviceReadIOps?: Array<InspectBlkioThrottleDevice>;
  /**
   * BlkioDeviceWriteBps is an array of I/O throttle parameters for
   * individual device nodes.
   * this specifically sets write rate cap in bytes per second for device
   * nodes.
   * as with BlkioWeightDevice, we pull the path from /sys/dev, and we
   * don't guarantee the path will be identical to the original (though
   * the node will be).
   */
  BlkioDeviceWriteBps?: Array<InspectBlkioThrottleDevice>;
  /**
   * BlkioDeviceWriteIOps is an array of I/O throttle parameters for
   * individual device nodes.
   * This specifically sets the write rate cap in iops per second for
   * device nodes.
   * As with BlkioWeightDevice, we pull the path from /sys/dev, and we
   * don't guarantee the path will be identical to the original (though
   * the node will be).
   */
  BlkioDeviceWriteIOps?: Array<InspectBlkioThrottleDevice>;
  /**
   * BlkioWeight indicates the I/O resources allocated to the container.
   * It is a relative weight in the scheduler for assigning I/O time
   * versus other Cgroups.
   */
  BlkioWeight?: number;
  /**
   * BlkioWeightDevice is an array of I/O resource priorities for
   * individual device nodes.
   * Unfortunately, the spec only stores the device's Major/Minor numbers
   * and not the path, which is used here.
   * Fortunately, the kernel provides an interface for retrieving the path
   * of a given node by major:minor at /sys/dev/. However, the exact path
   * in use may not be what was used in the original CLI invocation -
   * though it is guaranteed that the device node will be the same, and
   * using the given path will be functionally identical.
   */
  BlkioWeightDevice?: Array<InspectBlkioWeightDevice>;
  /**
   * CapAdd is a list of capabilities added to the container.
   * It is not directly stored by Libpod, and instead computed from the
   * capabilities listed in the container's spec, compared against a set
   * of default capabilities.
   */
  CapAdd?: Array<string>;
  /**
   * CapDrop is a list of capabilities removed from the container.
   * It is not directly stored by libpod, and instead computed from the
   * capabilities listed in the container's spec, compared against a set
   * of default capabilities.
   */
  CapDrop?: Array<string>;
  /**
   * Cgroup contains the container's cgroup. It is presently not
   * populated.
   * TODO.
   */
  Cgroup?: string;
  /**
   * CgroupConf is the configuration for cgroup v2.
   */
  CgroupConf?: Record<string, string>;
  /**
   * CgroupManager is the cgroup manager used by the container.
   * At present, allowed values are either "cgroupfs" or "systemd".
   */
  CgroupManager?: string;
  /**
   * CgroupMode is the configuration of the container's cgroup namespace.
   * Populated as follows:
   * private - a cgroup namespace has been created
   * host - No cgroup namespace created
   * container:<id> - Using another container's cgroup namespace
   * ns:<path> - A path to a cgroup namespace has been specified
   */
  CgroupMode?: string;
  /**
   * CgroupParent is the Cgroup parent of the container.
   * Only set if not default.
   */
  CgroupParent?: string;
  /**
   * Cgroups contains the container's Cgroup mode.
   * Allowed values are "default" (container is creating Cgroups) and
   * "disabled" (container is not creating Cgroups).
   * This is Libpod-specific and not included in `docker inspect`.
   */
  Cgroups?: string;
  /**
   * ConsoleSize is an array of 2 integers showing the size of the
   * container's console.
   * It is only set if the container is creating a terminal.
   * TODO.
   */
  ConsoleSize?: Array<number>;
  /**
   * ContainerIDFile is a file created during container creation to hold
   * the ID of the created container.
   * This is not handled within libpod and is stored in an annotation.
   */
  ContainerIDFile?: string;
  /**
   * CpuCount is Windows-only and not presently implemented.
   */
  CpuCount?: number;
  /**
   * CpuPercent is Windows-only and not presently implemented.
   */
  CpuPercent?: number;
  /**
   * CpuPeriod is the length of a CPU period in microseconds.
   * It relates directly to CpuQuota.
   */
  CpuPeriod?: number;
  /**
   * CpuPeriod is the amount of time (in microseconds) that a container
   * can use the CPU in every CpuPeriod.
   */
  CpuQuota?: number;
  /**
   * CpuRealtimePeriod is the length of time (in microseconds) of the CPU
   * realtime period. If set to 0, no time will be allocated to realtime
   * tasks.
   */
  CpuRealtimePeriod?: number;
  /**
   * CpuRealtimeRuntime is the length of time (in microseconds) allocated
   * for realtime tasks within every CpuRealtimePeriod.
   */
  CpuRealtimeRuntime?: number;
  /**
   * CpuShares indicates the CPU resources allocated to the container.
   * It is a relative weight in the scheduler for assigning CPU time
   * versus other Cgroups.
   */
  CpuShares?: number;
  /**
   * CpusetCpus is the set of CPUs that the container will execute on.
   * Formatted as `0-3` or `0,2`. Default (if unset) is all CPUs.
   */
  CpusetCpus?: string;
  /**
   * CpusetMems is the set of memory nodes the container will use.
   * Formatted as `0-3` or `0,2`. Default (if unset) is all memory nodes.
   */
  CpusetMems?: string;
  /**
   * Devices is a list of device nodes that will be added to the
   * container.
   * These are stored in the OCI spec only as type, major, minor while we
   * display the host path. We convert this with /sys/dev, but we cannot
   * guarantee that the host path will be identical - only that the actual
   * device will be.
   */
  Devices?: Array<InspectDevice>;
  /**
   * DiskQuota is the maximum amount of disk space the container may use
   * (in bytes).
   * Presently not populated.
   * TODO.
   */
  DiskQuota?: number;
  /**
   * Dns is a list of DNS nameservers that will be added to the
   * container's resolv.conf
   */
  Dns?: Array<string>;
  /**
   * DnsOptions is a list of DNS options that will be set in the
   * container's resolv.conf
   */
  DnsOptions?: Array<string>;
  /**
   * DnsSearch is a list of DNS search domains that will be set in the
   * container's resolv.conf
   */
  DnsSearch?: Array<string>;
  /**
   * ExtraHosts contains hosts that will be added to the container's
   * etc/hosts.
   */
  ExtraHosts?: Array<string>;
  /**
   * GroupAdd contains groups that the user inside the container will be
   * added to.
   */
  GroupAdd?: Array<string>;
  /**
   * HostsFile is the base file to create the `/etc/hosts` file inside the container.
   */
  HostsFile?: string;
  IDMappings?: InspectIDMappings;
  /**
   * IOMaximumBandwidth is Windows-only and not presently implemented.
   */
  IOMaximumBandwidth?: number;
  /**
   * IOMaximumIOps is Windows-only and not presently implemented.
   */
  IOMaximumIOps?: number;
  /**
   * Init indicates whether the container has an init mounted into it.
   */
  Init?: boolean;
  /**
   * IntelRdtClosID defines the Intel RDT CAT Class Of Service (COS) that
   * all processes of the container should run in.
   */
  IntelRdtClosID?: string;
  /**
   * IpcMode represents the configuration of the container's IPC
   * namespace.
   * Populated as follows:
   * "" (empty string) - Default, an IPC namespace will be created
   * host - No IPC namespace created
   * container:<id> - Using another container's IPC namespace
   * ns:<path> - A path to an IPC namespace has been specified
   */
  IpcMode?: string;
  /**
   * Isolation is presently unused and provided solely for Docker
   * compatibility.
   */
  Isolation?: string;
  /**
   * KernelMemory is the maximum amount of memory the kernel will devote
   * to the container.
   */
  KernelMemory?: number;
  /**
   * Links is unused, and provided purely for Docker compatibility.
   */
  Links?: Array<string>;
  LogConfig?: InspectLogConfig;
  /**
   * Memory indicates the memory resources allocated to the container.
   * This is the limit (in bytes) of RAM the container may use.
   */
  Memory?: number;
  /**
   * MemoryReservation is the reservation (soft limit) of memory available
   * to the container. Soft limits are warnings only and can be exceeded.
   */
  MemoryReservation?: number;
  /**
   * MemorySwap is the total limit for all memory available to the
   * container, including swap. 0 indicates that there is no limit to the
   * amount of memory available.
   */
  MemorySwap?: number;
  /**
   * MemorySwappiness is the willingness of the kernel to page container
   * memory to swap. It is an integer from 0 to 100, with low numbers
   * being more likely to be put into swap.
   * nil means swappiness is unset and the system default is used.
   */
  MemorySwappiness?: number;
  /**
   * NanoCpus indicates number of CPUs allocated to the container.
   * It is an integer where one full CPU is indicated by 1000000000 (one
   * billion).
   * Thus, 2.5 CPUs (fractional portions of CPUs are allowed) would be
   * 2500000000 (2.5 billion).
   * In 'docker inspect' this is set exclusively of two further options in
   * the output (CpuPeriod and CpuQuota) which are both used to implement
   * this functionality.
   * We can't distinguish here, so if CpuQuota is set to the default of
   * 100000, we will set both CpuQuota, CpuPeriod, and NanoCpus. If
   * CpuQuota is not the default, we will not set NanoCpus.
   */
  NanoCpus?: number;
  /**
   * NetworkMode is the configuration of the container's network
   * namespace.
   * Populated as follows:
   * default - A network namespace is being created and configured
   * none - A network namespace is being created, not configured
   * host - No network namespace created
   * container:<id> - Using another container's network namespace
   * ns:<path> - A path to a network namespace has been specified
   */
  NetworkMode?: string;
  /**
   * OomKillDisable indicates whether the kernel OOM killer is disabled
   * for the container.
   */
  OomKillDisable?: boolean;
  /**
   * OOMScoreAdj is an adjustment that will be made to the container's OOM
   * score.
   */
  OomScoreAdj?: number;
  /**
   * PidMode represents the configuration of the container's PID
   * namespace.
   * Populated as follows:
   * "" (empty string) - Default, a PID namespace will be created
   * host - No PID namespace created
   * container:<id> - Using another container's PID namespace
   * ns:<path> - A path to a PID namespace has been specified
   */
  PidMode?: string;
  /**
   * PidsLimit is the maximum number of PIDs that may be created within
   * the container. 0, the default, indicates no limit.
   */
  PidsLimit?: number;
  /**
   * PortBindings contains the container's port bindings.
   * It is formatted as map[string][]InspectHostPort.
   * The string key here is formatted as <integer port number>/<protocol>
   * and represents the container port. A single container port may be
   * bound to multiple host ports (on different IPs).
   */
  PortBindings?: Record<string, Array<InspectHostPort>>;
  /**
   * Privileged indicates whether the container is running with elevated
   * privileges.
   * This has a very specific meaning in the Docker sense, so it's very
   * difficult to decode from the spec and config, and so is stored as an
   * annotation.
   */
  Privileged?: boolean;
  /**
   * PublishAllPorts indicates whether image ports are being published.
   * This is not directly stored in libpod and is saved as an annotation.
   */
  PublishAllPorts?: boolean;
  /**
   * ReadonlyRootfs is whether the container will be mounted read-only.
   */
  ReadonlyRootfs?: boolean;
  RestartPolicy?: InspectRestartPolicy;
  /**
   * Runtime is provided purely for Docker compatibility.
   * It is set unconditionally to "oci" as Podman does not presently
   * support non-OCI runtimes.
   */
  Runtime?: string;
  /**
   * SecurityOpt is a list of security-related options that are set in the
   * container.
   */
  SecurityOpt?: Array<string>;
  ShmSize?: number;
  /**
   * Tmpfs is a list of tmpfs filesystems that will be mounted into the
   * container.
   * It is a map of destination path to options for the mount.
   */
  Tmpfs?: Record<string, string>;
  /**
   * UTSMode represents the configuration of the container's UID
   * namespace.
   * Populated as follows:
   * "" (empty string) - Default, a UTS namespace will be created
   * host - no UTS namespace created
   * container:<id> - Using another container's UTS namespace
   * ns:<path> - A path to a UTS namespace has been specified
   */
  UTSMode?: string;
  /**
   * Ulimits is a set of ulimits that will be set within the container.
   */
  Ulimits?: Array<InspectUlimit>;
  /**
   * UsernsMode represents the configuration of the container's user
   * namespace.
   * When running rootless, a user namespace is created outside of libpod
   * to allow some privileged operations. This will not be reflected here.
   * Populated as follows:
   * "" (empty string) - No user namespace will be created
   * private - The container will be run in a user namespace
   * container:<id> - Using another container's user namespace
   * ns:<path> - A path to a user namespace has been specified
   * TODO Rootless has an additional 'keep-id' option, presently not
   * reflected here.
   */
  UsernsMode?: string;
  /**
   * VolumeDriver is presently unused and is retained for Docker
   * compatibility.
   */
  VolumeDriver?: string;
  /**
   * VolumesFrom is a list of containers which this container uses volumes
   * from. This is not handled directly within libpod and is stored in an
   * annotation.
   * It is formatted as an array of container names and IDs.
   */
  VolumesFrom?: Array<string>;
};
