/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Descriptor } from "./Descriptor.ts";
/**
 * The underlying data from imgspecv1.Manifest is also available.
 */
export type OCI1 = {
  /**
   * Annotations contains arbitrary metadata for the image manifest.
   */
  annotations?: Record<string, string>;
  /**
   * ArtifactType specifies the IANA media type of artifact when the manifest is used for an artifact.
   */
  artifactType?: string;
  config?: Descriptor;
  /**
   * Layers is an indexed list of layers referenced by the manifest.
   */
  layers?: Array<Descriptor>;
  /**
   * MediaType specifies the type of this document data structure e.g. `application/vnd.oci.image.manifest.v1+json`
   */
  mediaType?: string;
  /**
   * SchemaVersion is the image manifest schema that this image follows
   */
  schemaVersion?: number;
  subject?: Descriptor;
};
