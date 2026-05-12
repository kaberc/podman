/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * NamedVolume holds information about a named volume that will be mounted into
 * the container.
 */
export type NamedVolume = {
  /**
   * Destination to mount the named volume within the container. Must be
   * an absolute path. Path will be created if it does not exist.
   */
  Dest?: string;
  /**
   * IsAnonymous sets the named volume as anonymous even if it has a name
   * This is used for emptyDir volumes from a kube yaml
   */
  IsAnonymous?: boolean;
  /**
   * Name is the name of the named volume to be mounted. May be empty.
   * If empty, a new named volume with a pseudorandomly generated name
   * will be mounted at the given destination.
   */
  Name?: string;
  /**
   * Options are options that the named volume will be mounted with.
   */
  Options?: Array<string>;
  /**
   * SubPath stores the sub directory of the named volume to be mounted in the container
   */
  SubPath?: string;
};
