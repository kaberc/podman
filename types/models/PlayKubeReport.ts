/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayKubePod } from "./PlayKubePod.ts";
import type { PlayKubeVolume } from "./PlayKubeVolume.ts";
import type { PlaySecret } from "./PlaySecret.ts";
import type { PodRmReport } from "./PodRmReport.ts";
import type { PodStopReport } from "./PodStopReport.ts";
import type { SecretRmReport } from "./SecretRmReport.ts";
import type { VolumeRmReport } from "./VolumeRmReport.ts";
export type PlayKubeReport = {
  /**
   * If set, exit with the specified exit code.
   */
  ExitCode?: number;
  /**
   * Pods - pods created by play kube.
   */
  Pods?: Array<PlayKubePod>;
  RmReport?: Array<PodRmReport>;
  SecretRmReport?: Array<SecretRmReport>;
  /**
   * Secrets - secrets created by play kube
   */
  Secrets?: Array<PlaySecret>;
  /**
   * ServiceContainerID - ID of the service container if one is created
   */
  ServiceContainerID?: string;
  StopReport?: Array<PodStopReport>;
  VolumeRmReport?: Array<VolumeRmReport>;
  /**
   * Volumes - volumes created by play kube.
   */
  Volumes?: Array<PlayKubeVolume>;
};
