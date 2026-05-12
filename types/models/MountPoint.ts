/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Propagation } from "./Propagation.ts";
import type { Type } from "./Type.ts";
/**
 * This is used for reporting the mountpoints in use by a container.
 */
export type MountPoint = {
  /**
   * Destination is the path relative to the container root (`/`) where the
   * Source is mounted inside the container.
   */
  Destination?: string;
  /**
   * Driver is the volume driver used to create the volume (if it is a volume).
   */
  Driver?: string;
  /**
   * Mode is a comma separated list of options supplied by the user when
   * creating the bind/volume mount.
   *
   * The default is platform-specific (`"z"` on Linux, empty on Windows).
   */
  Mode?: string;
  /**
   * Name is the name reference to the underlying data defined by `Source`
   * e.g., the volume name.
   */
  Name?: string;
  Propagation?: Propagation;
  /**
   * RW indicates whether the mount is mounted writable (read-write).
   */
  RW?: boolean;
  /**
   * Source is the source location of the mount.
   *
   * For volumes, this contains the storage location of the volume (within
   * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
   * the source (host) part of the bind-mount. For `tmpfs` mount points, this
   * field is empty.
   */
  Source?: string;
  Type?: Type;
};
