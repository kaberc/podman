/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BuildIdentity } from "./BuildIdentity.ts";
import type { PullIdentity } from "./PullIdentity.ts";
import type { SignatureIdentity } from "./SignatureIdentity.ts";
/**
 * This is trusted information verified by the daemon and cannot be modified
 * by tagging an image to a different name.
 */
export type Identity = {
  /**
   * Build contains build reference information if image was created via build.
   */
  Build?: Array<BuildIdentity>;
  /**
   * Pull contains remote location information if image was created via pull.
   * If image was pulled via mirror, this contains the original repository location.
   * After successful push this images also contains the pushed repository location.
   */
  Pull?: Array<PullIdentity>;
  /**
   * Signature contains the properties of verified signatures for the image.
   */
  Signature?: Array<SignatureIdentity>;
};
