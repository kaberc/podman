/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * ConfigReference The config-only network source to provide the configuration for
 * this network.
 */
export type ConfigReference = {
  /**
   * The name of the config-only network that provides the network's
   * configuration. The specified network must be an existing config-only
   * network. Only network names are allowed, not network IDs.
   */
  Network?: string;
};
