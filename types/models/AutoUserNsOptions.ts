/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IDMap } from "./IDMap.ts";
export type AutoUserNsOptions = {
  /**
   * AdditionalGIDMappings specified additional GID mappings to include in
   * the generated user namespace.
   */
  AdditionalGIDMappings?: Array<IDMap>;
  /**
   * AdditionalUIDMappings specified additional UID mappings to include in
   * the generated user namespace.
   */
  AdditionalUIDMappings?: Array<IDMap>;
  /**
   * GroupFile to use if the container uses a volume.
   */
  GroupFile?: string;
  /**
   * InitialSize defines the minimum size for the user namespace.
   * The created user namespace will have at least this size.
   */
  InitialSize?: number;
  /**
   * PasswdFile to use if the container uses a volume.
   */
  PasswdFile?: string;
  /**
   * Size defines the size for the user namespace.  If it is set to a
   * value bigger than 0, the user namespace will have exactly this size.
   * If it is not set, some heuristics will be used to find its size.
   */
  Size?: number;
};
