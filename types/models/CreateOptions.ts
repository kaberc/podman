/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigReference } from "./ConfigReference.ts";
import type { IPAM } from "./IPAM.ts";
export type CreateOptions = {
  Attachable?: boolean;
  ConfigFrom?: ConfigReference;
  ConfigOnly?: boolean;
  /**
   * Name of the volume driver to use.
   */
  Driver?: string;
  EnableIPv4?: boolean;
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  Ingress?: boolean;
  Internal?: boolean;
  /**
   * User-defined key/value metadata.
   */
  Labels?: Record<string, string>;
  Options?: Record<string, string>;
  Scope?: string;
};
