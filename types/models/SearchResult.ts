/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * SearchResult describes a search result returned from a registry
 */
export type SearchResult = {
  /**
   * Description is a textual description of the repository
   */
  description?: string;
  /**
   * IsAutomated indicates whether the result is automated.
   *
   * Deprecated: the "is_automated" field is deprecated and will always be "false".
   */
  is_automated?: boolean;
  /**
   * IsOfficial is true if the result is from an official repository.
   */
  is_official?: boolean;
  /**
   * Name is the name of the repository
   */
  name?: string;
  /**
   * StarCount indicates the number of stars this repository has
   */
  star_count?: number;
};
