/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxIDMapping specifies UID/GID mappings
 */
export type LinuxIDMapping = {
  /**
   * ContainerID is the starting UID/GID in the container
   */
  containerID?: number;
  /**
   * HostID is the starting UID/GID on the host to be mapped to 'ContainerID'
   */
  hostID?: number;
  /**
   * Size is the number of IDs to be mapped
   */
  size?: number;
};
