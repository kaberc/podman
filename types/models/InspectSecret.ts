/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectSecret contains information on secrets mounted inside the container
 */
export type InspectSecret = {
  /**
   * ID is the GID of the mounted secret file
   */
  GID?: number;
  /**
   * ID is the ID of the secret
   */
  ID?: string;
  /**
   * ID is the ID of the mode of the mounted secret file
   */
  Mode?: number;
  /**
   * Name is the name of the secret
   */
  Name?: string;
  /**
   * ID is the UID of the mounted secret file
   */
  UID?: number;
};
