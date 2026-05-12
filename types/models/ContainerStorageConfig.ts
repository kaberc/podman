/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtifactVolume } from "./ArtifactVolume.ts";
import type { ImageVolume } from "./ImageVolume.ts";
import type { LinuxDevice } from "./LinuxDevice.ts";
import type { LinuxDeviceCgroup } from "./LinuxDeviceCgroup.ts";
import type { Mount } from "./Mount.ts";
import type { NamedVolume } from "./NamedVolume.ts";
import type { Namespace } from "./Namespace.ts";
import type { OverlayVolume } from "./OverlayVolume.ts";
import type { Secret } from "./Secret.ts";
/**
 * ContainerStorageConfig contains information on the storage configuration of a
 * container.
 */
export type ContainerStorageConfig = {
  /**
   * ArtifactVolumes volumes based on an existing artifact.
   */
  artifact_volumes?: Array<ArtifactVolume>;
  /**
   * ChrootDirs is an additional set of directories that need to be
   * treated as root directories. Standard bind mounts will be mounted
   * into paths relative to these directories.
   * Optional.
   */
  chroot_directories?: Array<string>;
  /**
   * Create the working directory if it doesn't exist.
   * If unset, it doesn't create it.
   * Optional.
   */
  create_working_dir?: boolean;
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
   * GPUs contains GPU device identifiers for CDI resolution.
   * These will be resolved to full CDI device paths on the server side.
   * Optional.
   */
  gpus?: Array<string>;
  /**
   * HostDeviceList is used to recreate the mounted device on inherited containers
   */
  host_device_list?: Array<LinuxDevice>;
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
   * InitPath specifies the path to the init binary that will be added if
   * Init is specified above. If not specified, the default set in the
   * Libpod config will be used. Ignored if Init above is not set.
   * Optional.
   */
  init_path?: string;
  ipcns?: Namespace;
  /**
   * Mounts are mounts that will be added to the container.
   * These will supersede Image Volumes and VolumesFrom volumes where
   * there are conflicts.
   * Optional.
   */
  mounts?: Array<Mount>;
  /**
   * Overlay volumes are named volumes that will be added to the container.
   * Optional.
   */
  overlay_volumes?: Array<OverlayVolume>;
  /**
   * RawImageName is the user-specified and unprocessed input referring
   * to a local or a remote image.
   * Optional, but strongly encouraged to be set if Image is set.
   */
  raw_image_name?: string;
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
   * Secrets are the secrets that will be added to the container
   * Optional.
   */
  secrets?: Array<Secret>;
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
   * StorageOpts is the container's storage options
   * Optional.
   */
  storage_opts?: Record<string, string>;
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
   * WorkDir is the container's working directory.
   * If unset, the default, /, will be used.
   * Optional.
   */
  work_dir?: string;
};
