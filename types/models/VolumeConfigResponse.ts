/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VolumeConfigResponse = {
  /**
   * Anonymous indicates that the volume was created as an anonymous
   * volume for a specific container, and will be removed when unknown
   * container using it is removed.
   */
  Anonymous?: boolean;
  /**
   * CreatedAt is the date and time the volume was created at. This is not
   * stored for older Libpod volumes; if so, it will be omitted.
   */
  CreatedAt?: string;
  /**
   * Driver is the driver used to create the volume.
   * If set to "local" or "", the Local driver (Podman built-in code) is
   * used to service the volume; otherwise, a volume plugin with the given
   * name is used to mount and manage the volume.
   */
  Driver?: string;
  /**
   * GID is the GID that the volume was created with.
   */
  GID?: number;
  /**
   * Labels includes the volume's configured labels, key:value pairs that
   * can be passed during volume creation to provide information for third
   * party tools.
   */
  Labels?: Record<string, string>;
  /**
   * LockNumber is the number of the volume's Libpod lock.
   */
  LockNumber?: number;
  /**
   * MountCount is the number of times this volume has been mounted.
   */
  MountCount?: number;
  /**
   * Mountpoint is the path on the host where the volume is mounted.
   */
  Mountpoint?: string;
  /**
   * Name is the name of the volume.
   */
  Name?: string;
  /**
   * NeedsChown indicates that the next time the volume is mounted into
   * a container, the container will chown the volume to the container process
   * UID/GID.
   */
  NeedsChown?: boolean;
  /**
   * NeedsCopyUp indicates that the next time the volume is mounted into
   */
  NeedsCopyUp?: boolean;
  /**
   * Options is a set of options that were used when creating the volume.
   * For the Local driver, these are mount options that will be used to
   * determine how a local filesystem is mounted; they are handled as
   * parameters to Mount in a manner described in the volume create
   * manpage.
   * For non-local drivers, these are passed as-is to the volume plugin.
   */
  Options?: Record<string, string>;
  /**
   * Scope is unused and provided solely for Docker compatibility. It is
   * unconditionally set to "local".
   */
  Scope?: string;
  /**
   * Status is used to return information on the volume's current state,
   * if the volume was created using a volume plugin (uses a Driver that
   * is not the local driver).
   * Status is provided to us by an external program, so no guarantees are
   * made about its format or contents. Further, it is an optional field,
   * so it may not be set even in cases where a volume plugin is in use.
   */
  Status?: Record<string, unknown>;
  /**
   * StorageID is the ID of the container backing the volume in c/storage.
   * Only used with Image Volumes.
   */
  StorageID?: string;
  /**
   * Timeout is the specified driver timeout if given
   */
  Timeout?: number;
  /**
   * UID is the UID that the volume was created with.
   */
  UID?: number;
};
