/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * ImageVolume is a volume based on a container image.  The container image is
 * first mounted on the host and is then bind-mounted into the container.  An
 * ImageVolume is always mounted read-only.
 */
export type ImageVolume = {
  /**
   * Destination is the absolute path of the mount in the container.
   */
  Destination?: string;
  /**
   * ReadWrite sets the volume writable.
   */
  ReadWrite?: boolean;
  /**
   * Source is the source of the image volume.  The image can be referred
   * to by name and by ID.
   */
  Source?: string;
  /**
   * SubPath mounts a particular path within the image.
   * If empty, the whole image is mounted.
   */
  subPath?: string;
};
