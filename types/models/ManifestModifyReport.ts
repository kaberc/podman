/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ManifestModifyReport = {
  /**
   * Manifest List ID
   */
  Id?: string;
  /**
   * Errors associated with operation
   */
  errors?: Array<string>;
  /**
   * Files added to manifest list, otherwise not provided.
   */
  files?: Array<string>;
  /**
   * Images added to or removed from manifest list, otherwise not provided.
   */
  images?: Array<string>;
};
