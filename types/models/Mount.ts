/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindOptions } from "./BindOptions.ts";
import type { ClusterOptions } from "./ClusterOptions.ts";
import type { Consistency } from "./Consistency.ts";
import type { ImageOptions } from "./ImageOptions.ts";
import type { TmpfsOptions } from "./TmpfsOptions.ts";
import type { Type } from "./Type.ts";
import type { VolumeOptions } from "./VolumeOptions.ts";
export type Mount = {
  BindOptions?: BindOptions;
  ClusterOptions?: ClusterOptions;
  Consistency?: Consistency;
  ImageOptions?: ImageOptions;
  ReadOnly?: boolean;
  /**
   * Source specifies the name of the mount. Depending on mount type, this
   * may be a volume name or a host path, or even ignored.
   * Source is not supported for tmpfs (must be an empty value)
   */
  Source?: string;
  Target?: string;
  TmpfsOptions?: TmpfsOptions;
  Type?: Type;
  VolumeOptions?: VolumeOptions;
};
