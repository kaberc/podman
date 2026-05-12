/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Digest } from "./Digest.ts";
import type { DriverData } from "./DriverData.ts";
import type { History } from "./History.ts";
import type { ImageConfig } from "./ImageConfig.ts";
import type { RootFS } from "./RootFS.ts";
import type { Schema2HealthConfig } from "./Schema2HealthConfig.ts";
export type ImageData = {
  Annotations?: Record<string, string>;
  Architecture?: string;
  Author?: string;
  Comment?: string;
  Config?: ImageConfig;
  Created?: string;
  Digest?: Digest;
  GraphDriver?: DriverData;
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
  RootFS?: RootFS;
  Size?: number;
  User?: string;
  Version?: string;
  VirtualSize?: number;
};
