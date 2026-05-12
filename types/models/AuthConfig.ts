/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * AuthConfig contains authorization information for connecting to a Registry
 */
export type AuthConfig = {
  auth?: string;
  /**
   * Email is an optional value associated with the username.
   * This field is deprecated and will be removed in a later
   * version of docker.
   */
  email?: string;
  /**
   * IdentityToken is used to authenticate the user and get
   * an access token for the registry.
   */
  identitytoken?: string;
  password?: string;
  /**
   * RegistryToken is a bearer token to be sent to a registry
   */
  registrytoken?: string;
  serveraddress?: string;
  username?: string;
};
