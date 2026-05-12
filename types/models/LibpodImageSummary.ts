/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LibpodImageSummary = {
  /**
   * Podman extensions
   */
  Arch?: string;
  Containers?: number;
  Created?: number;
  Dangling?: boolean;
  Digest?: string;
  History?: Array<string>;
  Id?: string;
  /**
   * IsManifestList is a ptr so we can distinguish between a true
   * json empty response and false.  the docker compat side needs to return
   * empty; where as the libpod side needs a value of true or false
   */
  IsManifestList?: boolean;
  Labels?: Record<string, string>;
  Names?: Array<string>;
  Os?: string;
  ParentId?: string;
  ReadOnly?: boolean;
  RepoDigests?: Array<string>;
  RepoTags?: Array<string>;
  SharedSize?: number;
  Size?: number;
  VirtualSize?: number;
};
