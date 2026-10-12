/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtifactPullProgress } from "./ArtifactPullProgress.ts";
import type { ImagePullStatus } from "./ImagePullStatus.ts";
export type LibpodImagesPullReport = {
  /**
   * Error contains text of errors from c/image.
   * Populated when streaming is enabled and image status is "error".
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
  pullProgress?: ArtifactPullProgress;
  status?: ImagePullStatus;
  /**
   * Stream used to provide output from c/image.
   * Populated when streaming is enabled and image status is "pulling".
   */
  stream?: string;
};
