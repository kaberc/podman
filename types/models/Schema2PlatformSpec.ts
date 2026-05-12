/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema2PlatformSpec describes the platform which a particular manifest is
 * specialized for.
 * This is publicly visible as c/image/manifest.Schema2PlatformSpec.
 */
export type Schema2PlatformSpec = {
  architecture?: string;
  features?: Array<string>;
  os?: string;
  "os.features"?: Array<string>;
  "os.version"?: string;
  variant?: string;
};
