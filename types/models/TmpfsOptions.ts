/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileMode } from "./FileMode.ts";
export type TmpfsOptions = {
  Mode?: FileMode;
  /**
   * Options to be passed to the tmpfs mount. An array of arrays. Flag
   * options should be provided as 1-length arrays. Other types should be
   * provided as 2-length arrays, where the first item is the key and the
   * second the value.
   */
  Options?: Array<Array<string>>;
  /**
   * Size sets the size of the tmpfs, in bytes.
   *
   * This will be converted to an operating system specific value
   * depending on the host. For example, on linux, it will be converted to
   * use a 'k', 'm' or 'g' syntax. BSD, though not widely supported with
   * docker, uses a straight byte value.
   *
   * Percentages are not supported.
   */
  SizeBytes?: number;
};
