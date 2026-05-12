/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KnownSignerIdentity } from "./KnownSignerIdentity.ts";
import type { SignatureTimestamp } from "./SignatureTimestamp.ts";
import type { SignatureType } from "./SignatureType.ts";
import type { SignerIdentity } from "./SignerIdentity.ts";
export type SignatureIdentity = {
  /**
   * DockerReference is the Docker image reference associated with the signature.
   * This is an optional field only present in older hashedrecord signatures.
   */
  DockerReference?: string;
  /**
   * Error contains error information if signature verification failed.
   * Other fields will be empty in this case.
   */
  Error?: string;
  KnownSigner?: KnownSignerIdentity;
  /**
   * Name is a textual description summarizing the type of signature.
   */
  Name?: string;
  SignatureType?: SignatureType;
  Signer?: SignerIdentity;
  /**
   * Timestamps contains a list of verified signed timestamps for the signature.
   */
  Timestamps?: Array<SignatureTimestamp>;
  /**
   * Warnings contains unknown warnings that occurred during signature verification.
   * For example, if there was no internet connectivity and cached trust roots were used.
   * Warning does not indicate a failed verification but may point to configuration issues.
   */
  Warnings?: Array<string>;
};
