/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * ManifestAddOptions provides model for adding digests to manifest list
 */
export type ManifestAddOptions = {
  /**
   * True when operating on a list to include all images
   */
  all?: boolean;
  /**
   * Annotation to add to the item in the manifest list
   */
  annotation?: Array<string>;
  /**
   * Annotations to add to the item in the manifest list by a map which is preferred over Annotation
   */
  annotations?: Record<string, string>;
  /**
   * Arch overrides the architecture for the item in the manifest list
   */
  arch?: string;
  /**
   * Feature list for the item in the manifest list
   */
  features?: Array<string>;
  /**
   * Images is an optional list of image references to add to manifest list
   */
  images?: Array<string>;
  /**
   * IndexAnnotation is a slice of key=value annotations to add to the manifest list itself
   */
  index_annotation?: Array<string>;
  /**
   * IndexAnnotations is a map of key:value annotations to add to the manifest list itself, by a map which is preferred over IndexAnnotation
   */
  index_annotations?: Record<string, string>;
  /**
   * OS overrides the operating system for the item in the manifest list
   */
  os?: string;
  /**
   * OS features for the item in the manifest list
   */
  os_features?: Array<string>;
  /**
   * OSVersion overrides the operating system for the item in the manifest list
   */
  os_version?: string;
  /**
   * IndexSubject is a subject value to set in the manifest list itself
   */
  subject?: string;
  /**
   * Variant for the item in the manifest list
   */
  variant?: string;
};
