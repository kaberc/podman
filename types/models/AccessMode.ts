/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Scope } from "./Scope.ts";
import type { SharingMode } from "./SharingMode.ts";
import type { TypeBlock } from "./TypeBlock.ts";
import type { TypeMount } from "./TypeMount.ts";
export type AccessMode = {
  BlockVolume?: TypeBlock;
  MountVolume?: TypeMount;
  Scope?: Scope;
  Sharing?: SharingMode;
};
