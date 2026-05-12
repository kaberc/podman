/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VolumeCreateOptions = {
  /**
   * Volume driver to use
   */
  Driver?: string;
  /**
   * GID that the volume will be created as
   */
  GID?: number;
  /**
   * Ignore existing volumes
   */
  IgnoreIfExists?: boolean;
  /**
   * User-defined key/value metadata. Provided for compatibility
   */
  Label?: Record<string, string>;
  /**
   * User-defined key/value metadata. Preferred field, will override Label
   */
  Labels?: Record<string, string>;
  /**
   * New volume's name. Can be left blank
   */
  Name?: string;
  /**
   * Mapping of driver options and values.
   */
  Options?: Record<string, string>;
  /**
   * UID that the volume will be created as
   */
  UID?: number;
};
