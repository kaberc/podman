/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComponentVersion } from "./ComponentVersion.ts";
/**
 * SystemComponentVersion is the type used by pkg/domain/entities
 */
export type SystemComponentVersion = {
  ApiVersion?: string;
  Arch?: string;
  BuildTime?: string;
  Components?: Array<ComponentVersion>;
  Experimental?: boolean;
  GitCommit?: string;
  GoVersion?: string;
  KernelVersion?: string;
  MinAPIVersion?: string;
  Os?: string;
  Platform?: {
    Name?: string;
  };
  Version?: string;
};
