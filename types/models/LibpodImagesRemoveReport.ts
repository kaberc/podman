/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageRemoveReport } from "./ImageRemoveReport.ts";
/**
 * LibpodImagesRemoveReport is the return type for image removal via the rest
 * api.
 */
export type LibpodImagesRemoveReport = ImageRemoveReport & {
  /**
   * Image removal requires is to return data and an error.
   */
  Errors?: Array<string>;
};
