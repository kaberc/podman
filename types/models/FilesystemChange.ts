/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangeType } from "./ChangeType.ts";
export type FilesystemChange = {
  Kind: ChangeType;
  /**
   * Path to file or directory that has changed.
   */
  Path: string;
};
