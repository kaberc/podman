/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * SystemCheckReport provides a report of what a storage consistency check
 * found, and if we removed anything that was damaged, what we removed.
 */
export type SystemCheckReport = {
  Containers?: Record<string, Array<string>>;
  Errors?: boolean;
  Images?: Record<string, Array<string>>;
  Layers?: Record<string, Array<string>>;
  ROImages?: Record<string, Array<string>>;
  ROLayers?: Record<string, Array<string>>;
  RemovedContainers?: Record<string, string>;
  RemovedImages?: Record<string, Array<string>>;
  RemovedLayers?: Array<string>;
};
