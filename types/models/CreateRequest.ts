/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigReference } from "./ConfigReference.ts";
import type { IPAM } from "./IPAM.ts";
export type CreateRequest = {
  Attachable?: boolean;
  ConfigFrom?: ConfigReference;
  ConfigOnly?: boolean;
  Driver?: string;
  EnableIPv4?: boolean;
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  Ingress?: boolean;
  Internal?: boolean;
  Labels?: Record<string, string>;
  Name?: string;
  Options?: Record<string, string>;
  Scope?: string;
};
