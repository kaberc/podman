/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxIDMapping } from "./LinuxIDMapping.ts";
export type SpecsGoMount = {
  /**
   * Destination is the absolute path where the mount will be placed in the container.
   */
  destination?: string;
  gidMappings?: Array<LinuxIDMapping>;
  /**
   * Options are fstab style mount options.
   */
  options?: Array<string>;
  /**
   * Source specifies the source path of the mount.
   */
  source?: string;
  /**
   * Type specifies the mount kind.
   */
  type?: string;
  /**
   * UID/GID mappings used for changing file owners w/o calling chown, fs should support it.
   * Every mount point could have its own mapping.
   */
  uidMappings?: Array<LinuxIDMapping>;
};
