/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A ListQuadlet is a single Quadlet to be listed by `podman quadlet list`
 */
export type ListQuadlet = {
  /**
   * If multiple quadlets were installed together they will belong
   * to common App.
   */
  App?: string;
  /**
   * Name is the name of the Quadlet file
   */
  Name?: string;
  /**
   * Path to the Quadlet on disk
   */
  Path?: string;
  /**
   * Pod is the pod Quadlet file referenced by Pod= in [Container]
   * Empty for quadlet types that do not support Pod=
   */
  Pod?: string;
  /**
   * What is the status of the Quadlet - if present in systemd, will be a
   * systemd status, else will mention if the Quadlet has syntax errors
   */
  Status?: string;
  /**
   * UnitName is the name of the systemd unit created from the Quadlet.
   * May be empty if systemd has not be reloaded since it was installed.
   */
  UnitName?: string;
};
