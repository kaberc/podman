/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ManifestRemoveReport = {
  /**
   * Deleted manifest list.
   */
  Deleted?: Array<string>;
  /**
   * Errors associated with operation
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
