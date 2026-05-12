/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * swagger 2.0 does not support oneOf for schema validation.
 *
 * Operation "update" uses all fields.
 * Operation "remove" uses fields: Operation and Images
 * Operation "annotate" uses fields: Operation and Annotations
 */
export type ManifestModifyOptions = {
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
  artifact_annotations?: Record<string, string>;
  artifact_config?: string;
  artifact_config_type?: string;
  artifact_exclude_titles?: boolean;
  artifact_files?: Array<string>;
  artifact_layer_type?: string;
  artifact_subject?: string;
  /**
   * The following are all of the fields from ManifestAddArtifactOptions.
   * We can't just embed the whole structure because it embeds a
   * ManifestAnnotateOptions, which would conflict with the one that
   * ManifestAddOptions embeds.
   */
  artifact_type?: string;
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
  operation?: string;
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
