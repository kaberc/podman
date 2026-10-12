/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoUserNsOptions } from "./AutoUserNsOptions.ts";
import type { IDMap } from "./IDMap.ts";
/**
 * These options express what the caller wants, the mapping that the
 * container's user namespace should use.  They do not describe what is
 * stored on disk.  Depending on the graph driver, the store may apply
 * the mapping at layer creation time (by chowning files) or defer it to
 * mount time (using idmapped mounts or fuse-overlayfs options), but
 * that distinction is transparent to the caller.
 *
 * The resolution order for the effective UID/GID maps is:
 * 1. If HostUIDMapping/HostGIDMapping is true, no mapping is used (the
 * corresponding UIDMap/GIDMap is ignored and treated as empty).
 * 2. If UIDMap/GIDMap contain at least one entry, those mappings are used.
 * 3. Otherwise, if the layer has a parent, the parent's mappings are inherited.
 * 4. Otherwise, the Store-level default mappings are used.
 */
export type IDMappingOptions = {
  AutoUserNs?: boolean;
  AutoUserNsOpts?: AutoUserNsOptions;
  /**
   * GIDMap defines the GID mappings for the user namespace.
   * Only used when HostGIDMapping is false.
   */
  GIDMap?: Array<IDMap>;
  /**
   * HostGIDMapping indicates that no GID mapping should be applied.
   * When true, GIDMap is ignored and files are accessed with host GIDs.
   */
  HostGIDMapping?: boolean;
  /**
   * HostUIDMapping indicates that no UID mapping should be applied.
   * When true, UIDMap is ignored and files are accessed with host UIDs.
   */
  HostUIDMapping?: boolean;
  /**
   * UIDMap defines the UID mappings for the user namespace.
   * Only used when HostUIDMapping is false.
   */
  UIDMap?: Array<IDMap>;
};
