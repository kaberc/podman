/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * IDMap contains a single entry for user namespace range remapping. An array
 * of IDMap entries represents the structure that will be provided to the Linux
 * kernel for creating a user namespace.
 */
export type IDMap = {
  container_id?: number;
  host_id?: number;
  size?: number;
};
