/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * SystemDfContainerReport describes a container for use with df
 */
export type SystemDfContainerReport = {
  Command?: Array<string>;
  ContainerID?: string;
  Created?: string;
  Image?: string;
  LocalVolumes?: number;
  Names?: string;
  RWSize?: number;
  Size?: number;
  Status?: string;
};
