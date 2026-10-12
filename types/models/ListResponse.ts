/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volume } from "./Volume.ts";
/**
 * # Volume list response
 */
export type ListResponse = {
  /**
   * List of volumes
   */
  Volumes?: Array<Volume>;
  /**
   * Warnings that occurred when fetching the list of volumes.
   */
  Warnings?: Array<string>;
};
