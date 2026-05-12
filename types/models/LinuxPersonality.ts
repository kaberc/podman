/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxPersonalityDomain } from "./LinuxPersonalityDomain.ts";
import type { LinuxPersonalityFlag } from "./LinuxPersonalityFlag.ts";
/**
 * LinuxPersonality represents the Linux personality syscall input
 */
export type LinuxPersonality = {
  domain?: LinuxPersonalityDomain;
  /**
   * Additional flags
   */
  flags?: Array<LinuxPersonalityFlag>;
};
