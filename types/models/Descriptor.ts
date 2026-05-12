/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Digest } from "./Digest.ts";
import type { Platform } from "./Platform.ts";
/**
 * This structure provides `application/vnd.oci.descriptor.v1+json` mediatype
 * when marshalled to JSON.
 */
export type Descriptor = {
  /**
   * Annotations contains arbitrary metadata relating to the targeted content.
   */
  annotations?: Record<string, string>;
  /**
   * ArtifactType is the IANA media type of this artifact.
   */
  artifactType?: string;
  /**
   * Data is an embedding of the targeted content. This is encoded as a base64
   * string when marshalled to JSON (automatically, by encoding/json). If
   * present, Data can be used directly to avoid fetching the targeted content.
   */
  data?: Array<number>;
  digest?: Digest;
  /**
   * MediaType is the media type of the object this schema refers to.
   */
  mediaType?: string;
  platform?: Platform;
  /**
   * Size specifies the size in bytes of the blob.
   */
  size?: number;
  /**
   * URLs specifies a list of URLs from which this object MAY be downloaded
   */
  urls?: Array<string>;
};
