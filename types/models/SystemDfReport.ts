/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemDfContainerReport } from "./SystemDfContainerReport.ts";
import type { SystemDfImageReport } from "./SystemDfImageReport.ts";
import type { SystemDfVolumeReport } from "./SystemDfVolumeReport.ts";
/**
 * SystemDfReport describes the response for df information
 */
export type SystemDfReport = {
  Containers?: Array<SystemDfContainerReport>;
  Images?: Array<SystemDfImageReport>;
  ImagesSize?: number;
  Volumes?: Array<SystemDfVolumeReport>;
};
