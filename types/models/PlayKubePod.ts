/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlayKubePod = {
  /**
   * ContainerErrors - unknown errors that occurred while starting containers
   * in the pod.
   */
  ContainerErrors?: Array<string>;
  /**
   * Containers - the IDs of the containers running in the created pod.
   */
  Containers?: Array<string>;
  /**
   * ID - ID of the pod created as a result of play kube.
   */
  ID?: string;
  /**
   * InitContainers - the IDs of the init containers to be run in the created pod.
   */
  InitContainers?: Array<string>;
  /**
   * Logs - non-fatal errors and log messages while processing.
   */
  Logs?: Array<string>;
};
