/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * OverlayVolume holds information about an overlay volume that will be mounted into
 * the container.
 */
export type OverlayVolume = {
  /**
   * Destination is the absolute path where the mount will be placed in the container.
   */
  destination?: string;
  /**
   * Options holds overlay volume options.
   */
  options?: Array<string>;
  /**
   * Source specifies the source path of the mount.
   */
  source?: string;
};
