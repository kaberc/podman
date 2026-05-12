/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Platform = {
  /**
   * Architecture field specifies the CPU architecture, for example
   * `amd64` or `ppc64le`.
   */
  architecture?: string;
  /**
   * OS specifies the operating system, for example `linux` or `windows`.
   */
  os?: string;
  /**
   * OSFeatures is an optional field specifying an array of strings,
   * each listing a required OS feature (for example on Windows `win32k`).
   */
  "os.features"?: Array<string>;
  /**
   * OSVersion is an optional field specifying the operating system
   * version, for example on Windows `10.0.14393.1066`.
   */
  "os.version"?: string;
  /**
   * Variant is an optional field specifying a variant of the CPU, for
   * example `v7` to specify ARMv7 when architecture is `arm`.
   */
  variant?: string;
};
