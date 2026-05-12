/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerStore } from "./ContainerStore.ts";
import type { ImageStore } from "./ImageStore.ts";
/**
 * StoreInfo describes the container storage and its
 * attributes
 */
export type StoreInfo = {
  containerStore?: ContainerStore;
  graphDriverName?: string;
  graphOptions?: Record<string, unknown>;
  graphRoot?: string;
  /**
   * GraphRootAllocated is how much space the graphroot has in bytes
   */
  graphRootAllocated?: number;
  /**
   * GraphRootUsed is how much of graphroot is used in bytes
   */
  graphRootUsed?: number;
  graphStatus?: Record<string, string>;
  imageCopyTmpDir?: string;
  imageStore?: ImageStore;
  runRoot?: string;
  transientStore?: boolean;
  volumePath?: string;
};
