/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Identity } from "./Identity.ts";
import type { Platform } from "./Platform.ts";
export type ImageProperties = {
  /**
   * Containers is an array containing the IDs of the containers that are
   * using this image.
   */
  Containers: Array<string>;
  Identity?: Identity;
  Platform: Platform;
  Size?: {
    /**
     * Unpacked is the size (in bytes) of the locally unpacked
     * (uncompressed) image content that's directly usable by the containers
     * running this image.
     * It's independent of the distributable content - e.g.
     * the image might still have an unpacked data that's still used by
     * some container even when the distributable/compressed content is
     * already gone.
     */
    Unpacked: number;
  };
};
