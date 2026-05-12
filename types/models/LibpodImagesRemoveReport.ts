/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LibpodImagesRemoveReport is the return type for image removal via the rest
 * api.
 */
export type LibpodImagesRemoveReport = {
  /**
   * Deleted images.
   */
  Deleted?: Array<string>;
  /**
   * Image removal requires is to return data and an error.
   */
  Errors?: Array<string>;
  /**
   * ExitCode describes the exit codes as described in the `podman rmi`
   * man page.
   */
  ExitCode?: number;
  /**
   * Untagged images. Can be longer than Deleted.
   */
  Untagged?: Array<string>;
};
