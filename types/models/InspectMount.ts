/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectMount provides a record of a single mount in a container. It contains
 * fields for both named and normal volumes. Only user-specified volumes will be
 * included, and tmpfs volumes are not included even if the user specified them.
 */
export type InspectMount = {
  /**
   * The destination directory for the volume. Specified as a path within
   * the container, as it would be passed into the OCI runtime.
   */
  Destination?: string;
  /**
   * The driver used for the named volume. Empty for bind mounts.
   */
  Driver?: string;
  /**
   * Contains SELinux :z/:Z mount options. Unclear what, if anything, else
   * goes in here.
   */
  Mode?: string;
  /**
   * The name of the volume. Empty for bind mounts.
   */
  Name?: string;
  /**
   * All remaining mount options. Additional data, not present in the
   * original output.
   */
  Options?: Array<string>;
  /**
   * Mount propagation for the mount. Can be empty if not specified, but
   * is always printed - no omitempty.
   */
  Propagation?: string;
  /**
   * Whether the volume is read-write
   */
  RW?: boolean;
  /**
   * The source directory for the volume.
   */
  Source?: string;
  /**
   * SubPath object from the volume. Specified as a path within
   * the source volume to be mounted at the Destination.
   */
  SubPath?: string;
  /**
   * Whether the mount is a volume or bind mount. Allowed values are
   * "volume" and "bind".
   */
  Type?: string;
};
