/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttestationProperties } from "./AttestationProperties.ts";
import type { Descriptor } from "./Descriptor.ts";
import type { ImageProperties } from "./ImageProperties.ts";
import type { ManifestKind } from "./ManifestKind.ts";
export type ManifestSummary = {
  AttestationData?: AttestationProperties;
  /**
   * Indicates whether all the child content (image config, layers) is
   * fully available locally
   */
  Available: boolean;
  Descriptor: Descriptor;
  /**
   * ID is the content-addressable ID of an image and is the same as the
   * digest of the image manifest.
   */
  ID: string;
  ImageData?: ImageProperties;
  Kind: ManifestKind;
  /**
   * Size is the size information of the content related to this manifest.
   * Note: These sizes only take the locally available content into account.
   */
  Size: {
    /**
     * Content is the size (in bytes) of all the locally present
     * content in the content store (e.g. image config, layers)
     * referenced by this manifest and its children.
     * This only includes blobs in the content store.
     */
    Content?: number;
    /**
     * Total is the total size (in bytes) of all the locally present
     * data (both distributable and non-distributable) that's related to
     * this manifest and its children.
     * This equal to the sum of [Content] size AND all the sizes in the
     * [Size] struct present in the Kind-specific data struct.
     * For example, for an image kind (Kind == ManifestKindImage),
     * this would include the size of the image content and unpacked
     * image snapshots ([Size.Content] + [ImageData.Size.Unpacked]).
     */
    Total?: number;
  };
};
