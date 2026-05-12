/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * SecurityInfo describes the libpod host
 */
export type SecurityInfo = {
  apparmorEnabled?: boolean;
  capabilities?: string;
  rootless?: boolean;
  seccompEnabled?: boolean;
  seccompProfilePath?: string;
  selinuxEnabled?: boolean;
};
