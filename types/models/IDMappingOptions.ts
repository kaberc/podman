/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoUserNsOptions } from "./AutoUserNsOptions.ts";
import type { IDMap } from "./IDMap.ts";
/**
 * IDMappingOptions are used for specifying how ID mapping should be set up for
 * a layer or container.
 */
export type IDMappingOptions = {
  AutoUserNs?: boolean;
  AutoUserNsOpts?: AutoUserNsOptions;
  GIDMap?: Array<IDMap>;
  HostGIDMapping?: boolean;
  /**
   * UIDMap and GIDMap are used for setting up a layer's root filesystem
   * for use inside of a user namespace where ID mapping is being used.
   * If HostUIDMapping/HostGIDMapping is true, no mapping of the
   * respective type will be used.  Otherwise, if UIDMap and/or GIDMap
   * contain at least one mapping, one or both will be used.  By default,
   * if neither of those conditions apply, if the layer has a parent
   * layer, the parent layer's mapping will be used, and if it does not
   * have a parent layer, the mapping which was passed to the Store
   * object when it was initialized will be used.
   */
  HostUIDMapping?: boolean;
  UIDMap?: Array<IDMap>;
};
