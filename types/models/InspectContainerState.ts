/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheckResults } from "./HealthCheckResults.ts";
/**
 * InspectContainerState provides a detailed record of a container's current
 * state. It is returned as part of InspectContainerData.
 * As with InspectContainerData, many portions of this struct are matched to
 * Docker, but here we see more fields that are unused (nonsensical in the
 * context of Libpod).
 */
export type InspectContainerState = {
  CgroupPath?: string;
  CheckpointLog?: string;
  CheckpointPath?: string;
  Checkpointed?: boolean;
  CheckpointedAt?: string;
  ConmonPid?: number;
  Dead?: boolean;
  Error?: string;
  ExitCode?: number;
  FinishedAt?: string;
  Health?: HealthCheckResults;
  OOMKilled?: boolean;
  OciVersion?: string;
  Paused?: boolean;
  Pid?: number;
  Restarting?: boolean;
  RestoreLog?: string;
  Restored?: boolean;
  RestoredAt?: string;
  Running?: boolean;
  StartedAt?: string;
  Status?: string;
  StoppedByUser?: boolean;
};
