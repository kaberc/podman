/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InspectDevice = {
  /**
   * CgroupPermissions is the permissions of the mounted device.
   * Presently not populated.
   * TODO.
   */
  CgroupPermissions?: string;
  /**
   * PathInContainer is the path of the device within the container.
   */
  PathInContainer?: string;
  /**
   * PathOnHost is the path of the device on the host.
   */
  PathOnHost?: string;
};
