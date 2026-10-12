/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefineDriverData } from "./DefineDriverData.ts";
import type { Digest } from "./Digest.ts";
import type { History } from "./History.ts";
import type { ImageConfig } from "./ImageConfig.ts";
import type { InspectRootFS } from "./InspectRootFS.ts";
import type { Schema2HealthConfig } from "./Schema2HealthConfig.ts";
export type ImageData = {
  Annotations?: Record<string, string>;
  Architecture?: string;
  Author?: string;
  Comment?: string;
  Config?: ImageConfig;
  Created?: string;
  Digest?: Digest;
  GraphDriver?: DefineDriverData;
  Healthcheck?: Schema2HealthConfig;
  History?: Array<History>;
  Id?: string;
  Labels?: Record<string, string>;
  ManifestType?: string;
  NamesHistory?: Array<string>;
  Os?: string;
  Parent?: string;
  RepoDigests?: Array<string>;
  RepoTags?: Array<string>;
  RootFS?: InspectRootFS;
  Size?: number;
  User?: string;
  Version?: string;
  VirtualSize?: number;
};
