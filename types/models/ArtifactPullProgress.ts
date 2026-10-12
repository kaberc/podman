/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtifactPullStatus } from "./ArtifactPullStatus.ts";
/**
 * Populated when streaming is enabled, image status is "pulling",
 * and there is pull progress to report.
 */
export type ArtifactPullProgress = {
  /**
   * Current is the number of bytes of the current artifact that have been
   * transferred so far.
   * Populated when artifact status is "pulling" or "success".
   */
  current?: number;
  /**
   * ProgressComponentID is the unique identifier for the artifact being pulled.
   * A value of "" indicates that the progress component ID is unknown.
   */
  progressComponentID?: string;
  status?: ArtifactPullStatus;
  /**
   * Total is the total size of the artifact in bytes. A value of -1
   * indicates that the total size is unknown.
   * Populated when artifact status is "pulling" or "success".
   */
  total?: number;
};
