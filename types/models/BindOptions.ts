/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Propagation } from "./Propagation.ts";
export type BindOptions = {
  CreateMountpoint?: boolean;
  NonRecursive?: boolean;
  Propagation?: Propagation;
  /**
   * ReadOnlyForceRecursive raises an error if the mount cannot be made recursively read-only.
   */
  ReadOnlyForceRecursive?: boolean;
  /**
   * ReadOnlyNonRecursive makes the mount non-recursively read-only, but still leaves the mount recursive
   * (unless NonRecursive is set to true in conjunction).
   */
  ReadOnlyNonRecursive?: boolean;
};
