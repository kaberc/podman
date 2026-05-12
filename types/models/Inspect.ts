/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigReference } from "./ConfigReference.ts";
import type { EndpointResource } from "./EndpointResource.ts";
import type { IPAM } from "./IPAM.ts";
import type { PeerInfo } from "./PeerInfo.ts";
import type { ServiceInfo } from "./ServiceInfo.ts";
export type Inspect = {
  Attachable?: boolean;
  ConfigFrom?: ConfigReference;
  ConfigOnly?: boolean;
  Containers?: Record<string, EndpointResource>;
  Created?: string;
  Driver?: string;
  EnableIPv4?: boolean;
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  Id?: string;
  Ingress?: boolean;
  Internal?: boolean;
  Labels?: Record<string, string>;
  Name?: string;
  Options?: Record<string, string>;
  Peers?: Array<PeerInfo>;
  Scope?: string;
  Services?: Record<string, ServiceInfo>;
};
