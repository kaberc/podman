/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageVolume } from "./ImageVolume.ts";
import type { Mount } from "./Mount.ts";
import type { NamedVolume } from "./NamedVolume.ts";
import type { OverlayVolume } from "./OverlayVolume.ts";
export type PodStorageConfig = {
  /**
   * Image volumes bind-mount a container-image mount into the pod's infra container.
   * Optional.
   */
  image_volumes?: Array<ImageVolume>;
  /**
   * Mounts are mounts that will be added to the pod.
   * These will supersede Image Volumes and VolumesFrom volumes where
   * there are conflicts.
   * Optional.
   */
  mounts?: Array<Mount>;
  /**
   * Overlay volumes are named volumes that will be added to the pod.
   * Optional.
   */
  overlay_volumes?: Array<OverlayVolume>;
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
