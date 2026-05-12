/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LibpodImagesPullReport = {
  /**
   * Error contains text of errors from c/image
   */
  error?: string;
  /**
   * ID contains image id (retained for backwards compatibility)
   */
  id?: string;
  /**
   * Images contains the ID's of the images pulled
   */
  images?: Array<string>;
  /**
   * Stream used to provide output from c/image
   */
  stream?: string;
};
