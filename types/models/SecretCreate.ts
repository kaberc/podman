/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SecretDriverSpec } from "./SecretDriverSpec.ts";
export type SecretCreate = {
  /**
   * Base64-url-safe-encoded (RFC 4648) data to store as secret.
   */
  Data?: string;
  Driver?: SecretDriverSpec;
  /**
   * Labels are labels on the secret
   */
  Labels?: Record<string, string>;
  /**
   * User-defined name of the secret.
   */
  Name?: string;
};
