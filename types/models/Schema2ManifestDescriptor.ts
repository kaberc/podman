/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Digest } from "./Digest.ts";
import type { Schema2PlatformSpec } from "./Schema2PlatformSpec.ts";
/**
 * This is publicly visible as c/image/manifest.Schema2ManifestDescriptor.
 */
export type Schema2ManifestDescriptor = {
  digest?: Digest;
  mediaType?: string;
  platform?: Schema2PlatformSpec;
  size?: number;
  urls?: Array<string>;
};
