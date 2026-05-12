/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Config } from "./Config.ts";
import type { Descriptor } from "./Descriptor.ts";
import type { DockerOCIImageConfig } from "./DockerOCIImageConfig.ts";
import type { DriverData } from "./DriverData.ts";
import type { Identity } from "./Identity.ts";
import type { ManifestSummary } from "./ManifestSummary.ts";
import type { Metadata } from "./Metadata.ts";
import type { RootFS } from "./RootFS.ts";
export type ImageInspect = {
  /**
   * Architecture is the hardware CPU architecture that the image runs on.
   */
  Architecture?: string;
  /**
   * Author is the name of the author that was specified when committing the
   * image, or as specified through MAINTAINER (deprecated) in the Dockerfile.
   * This field is omitted if not set.
   */
  Author?: string;
  /**
   * Comment is an optional message that can be set when committing or
   * importing the image. This field is omitted if not set.
   */
  Comment?: string;
  Config?: DockerOCIImageConfig;
  /**
   * When you embed a struct, the fields of the embedded struct are "promoted" to the outer struct.
   * If a field in the outer struct has the same name as a field in the embedded struct,
   * the outer struct's field will shadow or override the embedded one allowing for a clean way to
   * hide fields from the swagger spec that still exist in the libraries struct.
   */
  Container?: string;
  ContainerConfig?: Config;
  /**
   * Created is the date and time at which the image was created, formatted in
   * RFC 3339 nano-seconds (time.RFC3339Nano).
   *
   * This information is only available if present in the image,
   * and omitted otherwise.
   */
  Created?: string;
  Descriptor?: Descriptor;
  DockerVersion?: string;
  GraphDriver?: DriverData;
  /**
   * ID is the content-addressable ID of an image.
   *
   * This identifier is a content-addressable digest calculated from the
   * image's configuration (which includes the digests of layers used by
   * the image).
   *
   * Note that this digest differs from the `RepoDigests` below, which
   * holds digests of image manifests that reference the image.
   */
  Id?: string;
  Identity?: Identity;
  /**
   * Manifests is a list of image manifests available in this image. It
   * provides a more detailed view of the platform-specific image manifests or
   * other image-attached data like build attestations.
   *
   * Only available if the daemon provides a multi-platform image store, the client
   * requests manifests AND does not request a specific platform.
   *
   * WARNING: This is experimental and may change at unknown time without unknown backward
   * compatibility.
   */
  Manifests?: Array<ManifestSummary>;
  Metadata?: Metadata;
  /**
   * OS is the Operating System the image is built to run on.
   */
  Os?: string;
  /**
   * OsVersion is the version of the Operating System the image is built to
   * run on (especially for Windows).
   */
  OsVersion?: string;
  Parent?: string;
  /**
   * RepoDigests is a list of content-addressable digests of locally available
   * image manifests that the image is referenced from. Multiple manifests can
   * refer to the same image.
   *
   * These digests are usually only available if the image was either pulled
   * from a registry, or if the image was pushed to a registry, which is when
   * the manifest is generated and its digest calculated.
   */
  RepoDigests?: Array<string>;
  /**
   * RepoTags is a list of image names/tags in the local image cache that
   * reference this image.
   *
   * Multiple image tags can refer to the same image, and this list may be
   * empty if no tags reference the image, in which case the image is
   * "untagged", in which case it can still be referenced by its ID.
   */
  RepoTags?: Array<string>;
  RootFS?: RootFS;
  /**
   * Size is the total size of the image including all layers it is composed of.
   */
  Size?: number;
  /**
   * Variant is the CPU architecture variant (presently ARM-only).
   */
  Variant?: string;
  VirtualSize?: number;
};
